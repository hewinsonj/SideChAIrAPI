module.exports = (req, res, next) => {
  if (req.user && req.user.role === 'patient') {
    return next();
  } else {
    return res.status(403).json({ message: 'Access restricted to patients only.' });
  }
};
