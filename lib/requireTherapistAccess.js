module.exports = (req, res, next) => {
  if (req.user && req.user.role === 'therapist') {
    return next();
  } else {
    return res.status(403).json({ message: 'Access restricted to therapists only.' });
  }
};
