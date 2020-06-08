const mongoose = require('mongoose')


const userSigninSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  
  first_name: {
    type: String,
    required: false
  },
  
  last_name: {
    type: String,
    required: false
  },
  
  user_name: {
	type: String,
	required: false
  },
  
  hashed_pw: {
    type: String,
	required: true
  },
  
  is_admin: {
	type: Boolean,
	required: true,
	default: false
  }
  
})


userSigninSchema.pre('validate', function(next) {
	next();
})



module.exports = mongoose.model('UserSignin', userSigninSchema)