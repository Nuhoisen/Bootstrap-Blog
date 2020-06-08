
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById) {
   const authenticateUser = async (email, password, done) => {
    // Callback request queries the database for email
	const user = await getUserByEmail(email);
	
	if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.hashed_pw)) {
		console.log("Password is correct")
        return done(null, user)
      } else {
		console.log("Password is incorrect")
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use				( new LocalStrategy( { usernameField: 'email' }, authenticateUser) );
  passport.serializeUser	( (user, done) 	=> done(null, user.id) );
  passport.deserializeUser	( async (id, done) 	=> {
	var user =  await getUserById(id);
    return done(null, user);
  })
}

module.exports = initialize