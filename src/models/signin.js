const mongoose = require('mongoose')
const crypto = require('crypto');

const Token = require('./token');

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
  },
  
  isVerified: {
    type: Boolean,
    default: false
  },
  
})


userSigninSchema.pre('validate', function(next) {
	next();
})


userSigninSchema.methods.generateVerificationToken = function() {
  let payload = {
      userId: this._id,
      token: crypto.randomBytes(20).toString('hex')
  };

  return new Token(payload);
};

module.exports = mongoose.model('UserSignin', userSigninSchema)
