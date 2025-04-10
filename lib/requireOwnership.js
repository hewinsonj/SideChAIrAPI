const handle = require('./handle')

// Placeholder ownership check
module.exports = (req, res, next) => {
  // If you pass through without checks:
  return next()

  // Example structure for future use:
  /*
  if (String(resource.owner) === String(req.user._id)) {
    return next()
  } else {
    return res.status(403).json({ error: 'You do not own this resource.' })
  }
  */
}