// Formal Requires
const express 	= require('express')

// User Requires
const Subscriber 	= require('./../models/subscribe')
const {sendEmail} 	= require('../utils/utils')


const router 	= express.Router()

// if (process.env.NODE_ENV !== 'production'){

// 	Subscriber.Find({})
// 		.then(async err =>{
// 			if (err){
// 				console.log("Delete admin subscriber. Reason:")
// 				console.log(err)
// 			}
// 		})
// }



// Subscribe Get - Render Page
router.get("/", (req,res)=>{
	console.log("In subscribe get")
	res.render('subscribe', {		email:"you@example.com", 
                                    firstName: "", 
                                    lastName: "", 
                                    userName: "Username", 
                                    invalidField: "" });
});

//Subscribe Post - Add a user
router.post("/",  async (req, res) => {
	console.log("In Subscribe post")
	console.log(req.body.email)
	// Search to see if user already exists
	await Subscriber.find({email:req.body.email.toLowerCase()})
		.then(async exst_user => {
			
			if(exst_user.length){
                // User already subscriber. Nothing new
                console.log("Subscriber already exists!")
				res.redirect('/');
			}
			else{
				console.log("Creating new subscriber");
				// Add to subscriber list
				let subscriber = new Subscriber({	email: req.body.email.toLowerCase(),
													first_name: req.body.firstName,
													last_name: req.body.lastName,
												});

				try{
					subscriber = await subscriber.save();
                    await sendThankYouEmail(subscriber, req, res);
					res.redirect('/');
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



// Thank subscriber
async function sendThankYouEmail(subscriber, req, res){
    try{
        let subject = "Thanks For Subscribing";
        let to = subscriber.email;
        let from = process.env.FROM_EMAIL;
        let link="http://"+process.env.SITE_DOMAIN;
		subscriber.first_name = (subscriber.first_name) ? subscriber.first_name : "New Blogger";
        let html = `<p>Hi ${subscriber.first_name}!<p><br><p>Thanks For Subscribing.</p>
                    For more updates visit <a href="${link}">${link}</a>.</p> 
                  <br><p>If you did not request this, please ignore this email.</p>`;

        console.log("Sending Email");
	    await sendEmail({to, from, subject, html});
	    console.log("Successfully sent email");	
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = router
