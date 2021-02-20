
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (req, email, password, done) => {
    // Callback request queries the database for email
	const user = await getUserByEmail(email);
	
	if (user == null) {
      return done(null, false, req.flash('error', 'Email and/or Password Incorrect' )); //{ message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.hashed_pw)) {
		    console.log("Password is correct")
        // Make sure the user has been verified
        if (!user.isVerified) {
          console.log("User is not verified")
          return done(null, false, req.flash('error', 'User needs to verify their email')); //{message: 'User needs to verify their email'}); //res.status(401).json({ type: 'not-verified', message: 'Your account has not been verified.' });		// Addition
        }
        // User is verified
        return done(null, user)
      } else {
		    console.log("Password is incorrect")
        return done(null, false, req.flash('error', 'Email and/or Password Incorrect')); // { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use				( new LocalStrategy( { usernameField: 'email', passReqToCallback: true }, authenticateUser) );
  passport.serializeUser	( (user, done) 	=> done(null, user.id) );
  passport.deserializeUser	( async (id, done) 	=> {
	var user =  await getUserById(id);
    return done(null, user);
  })
}

module.exports = initialize