// Formal Requires
const express 	= require('express')
const bcrypt	= require('bcrypt')
const passport	= require('passport')

const router 	= express.Router()

// User Requires
const UserSignin 			= require('./../models/signin')
const initializePassport 	= require('../config/passport-config')

// Initialize passport
initializePassport(
	passport, 
	async inputEmail => {
		return await UserSignin.find({email: inputEmail.toLowerCase()})
							.then( async exst_user => {
								if(exst_user.length){
									return exst_user[0];
								}
								else {
									return null;
								}
							})
							.catch( async e => {
								return null;
							});
	},
	
	async inputId => {
		
		console.log("Inside id validation");
		return await UserSignin.findById(inputId)
							.then( async exst_user => {
								if(exst_user){
									return exst_user;
								}
								else {
									console.log("returning null")
									return null;
								}
							})
							.catch( async e => {
								return null;
							});

	}

);


function checkNotAuthenticated(req, res, next) {
	console.log("Checking if user is already authenticated middleware")
	if (req.isAuthenticated()){
		console.log("This user is already authenticated")
		return res.redirect('/');
	}
	next();
}


// Signin Get 
router.get('/', checkNotAuthenticated, (req,res)=>{
	console.log("In signin get")
	res.render('signin', {invalidField: "" } );
});


// Signin Post
router.post("/",  
	passport.authenticate('local', { failureRedirect:'/signin' } ), 
	  function(req, res) {
		var backURL = req.session.returnTo || '/';
		res.redirect(backURL);
	  }
);
  
	


module.exports = router