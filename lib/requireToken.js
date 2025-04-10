const passport = require('passport')

// middleware to require a token
const requireToken = (req, res, next) => {
    console.log('🔑 Authorization Header:', req.headers.authorization)
    passport.authenticate('bearer', { session: false }, (err, user, info) => {
      if (err) return next(err)
      if (!user) {
        console.log('❌ No user found for this token.')
        return res.status(401).json({ message: 'Unauthorized - invalid token' })
      }
      console.log('✅ User found:', user.email)
      req.user = user
      next()
    })(req, res, next)
  }

  
module.exports = requireToken

