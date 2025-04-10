// require authentication related packages
const passport = require('passport')
const bearer = require('passport-http-bearer')

// user model will be used to set `req.user` in
// authenticated routes
const User = require('../app/models/user')

// this strategy will grab a bearer token from the HTTP headers and then
// run the callback with the found token as `token`
const strategy = new bearer.Strategy(async function (token, done) {
	try {
		console.log('🔍 Bearer token received:', token)

		const user = await User.findOne({ token: token })

		if (!user) {
			console.log('❌ No user found for token:', token)
			return done(null, false)
		}

		console.log('✅ User found:', user.email)
		return done(null, user, { scope: 'all' })

	} catch (err) {
		console.error('🚨 Error during token lookup:', err)
		return done(err)
	}
})

// serialize and deserialize functions are used by passport under
// the hood to determine what `req.user` should be inside routes
passport.serializeUser((user, done) => {
	// we want access to the full Mongoose object that we got in the
	// strategy callback, so we just pass it along with no modifications
	done(null, user)
})

passport.deserializeUser((user, done) => {
	done(null, user)
})

// register this strategy with passport
passport.use(strategy)

// create a passport middleware based on all the above configuration
module.exports = passport.initialize()
