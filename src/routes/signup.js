// Formal Requires
const express 	= require('express')
const bcrypt	= require('bcrypt')


// User Requires
const Token 	= require('./../models/Token')
const UserSignin 	= require('./../models/signin')
const {sendEmail} = require('../utils/utils')


const router 	= express.Router()

if (process.env.NODE_ENV !== 'production'){
	// Output the admin
	// UserSignin.findOne({email : process.env.ADMIN_USER_EMAIL})
	// .then( async exst_admin => {
	// 		console.log("Found something");
	// 		console.log(exst_admin);
	// })
	// .catch ( err  => {
	// 		console.log("Admin not found");
	// });


	UserSignin.deleteOne({email: process.env.ADMIN_USER_EMAIL})
		.then(async err =>{
			if (err){
				console.log("Could Note Delete admin. Reason:")
				console.log(err)
			}
		})
}


//Sign Up - Go to fields page
router.get('/', (req,res)=>{
	console.log("In signup get")
	res.render('signup', {		email:"you@example.com", 
								firstName: "", 
								lastName: "", 
								userName: "Username", 
								invalidField: "" } );
});

//Sign Up - Add a user
router.post("/",  async (req, res) => {
	console.log("In signup post")
	console.log(req.body.email)
	// Search to see if user already exists
	await UserSignin.find({email:req.body.email.toLowerCase()})
		.then(async exst_user => {
			
			let local_admin = (req.body.email.toLowerCase() === process.env.ADMIN_USER_EMAIL) ? true : false;
			// Create the user fields
			// Either to enter, or to return to form
			let new_user_fields = {
				  first_name:	req.body.firstName,
				  last_name:	req.body.lastName,
				  user_name:	req.body.userName,
				  email: 		req.body.email.toLowerCase(),
				  is_admin:		local_admin
				}
			
			if(exst_user.length){
				console.log(exst_user);
				console.log("User already exists");
				res.render('signup', {		email: 		new_user_fields["email"], 
											firstName: 	new_user_fields["first_name"], 
											lastName: 	new_user_fields["last_name"], 
											userName:	new_user_fields["user_name"],
											invalidField:	"This email is already registered"} );
			}
			else{
				console.log("Creating new user");
				// 								(Password, # of Rounds to gen. salt)
				const hashedPassword = await bcrypt.hash(req.body.password, 10);
				
				new_user_fields.hashed_pw = hashedPassword;
				
				let new_user = new UserSignin(new_user_fields);
				
				try{
					new_user = await new_user.save();

					await sendVerificationEmail(new_user, req, res);	// NEW ADDTION	this will generate a token and send a verification email with it, embedded

					console.log("New User successfully saved");
					res.redirect('/signin');
				}
				catch(e){
					console.log(e);
				}
			}
		})
		// Error occurred
		.catch(async e => {
			console.log(e);
		});
});




// URL via verificiation token, accessed only via email
router.get('/api/auth/verify/:token', async (req,res)=>{
	console.log("User is verifying token")
	if(!req.params.token) return res.status(400).json({message: "We were unable to find a user for this token."});

    try {
        // Find a matching token
        const token = await Token.findOne({ token: req.params.token });

        if (!token) return res.status(400).json({ message: 'We were unable to find a valid token. Your token my have expired.' });
        // If we found a token, find a matching user
        UserSignin.findOne({ _id: token.userId }, (err, user) => {
            if (!user) return res.status(400).json({ message: 'We were unable to find a user for this token.' });

            if (user.isVerified) return res.status(400).json({ message: 'This user has already been verified.' });

            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) return res.status(500).json({message:err.message});
				req.flash('info', 'Thanks for verifying. Please Sign In')
				res.redirect('/signin');
            });
        });
    } catch (error) {
        res.status(500).json({message: error.message})
    }


})

// Used to send email to verified user
async function sendVerificationEmail(user, req, res){
    try{

        console.log("Generating Token");
        const token = user.generateVerificationToken();

        // Save the verification token

        console.log("Verifying Token");
        await token.save();

        let subject = "Account Verification Token";
        let to = user.email;
        let from = process.env.FROM_EMAIL;
        let link="http://"+req.headers.host+"/signup/api/auth/verify/"+token.token;
		console.log("Email Link: " + link)
        let html = `<p>Hi ${user.user_name}<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p> 
                  <br><p>If you did not request this, please ignore this email.</p>`;

        console.log("Sending Email");
	await sendEmail({to, from, subject, html});
	console.log("Successfully sent email");	
        // res.status(200).json({message: 'A verification email has been sent to ' + user.email + '.'});		

    }catch (error) {
	console.log("Error occurred");
        res.status(500).json({message: error.message})
    }
}

module.exports = router
