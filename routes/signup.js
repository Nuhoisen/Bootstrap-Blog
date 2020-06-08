// Formal Requires
const express 	= require('express')
const bcrypt	= require('bcrypt')


const router 	= express.Router()



// User Requires
const UserSignin 	= require('./../models/signin')

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
			
			let local_admin = (req.body.email.toLowerCase() === "kellyhonsing@gmail.com") ? true : false;
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



module.exports = router