const passport = require('passport');

const authenticateRole = (role) => {
  return (req, res, next) => {
    passport.authenticate(role, { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

module.exports = {
  authenticatePetani: authenticateRole('jwt-petani'),
  authenticatePembeli: authenticateRole('jwt-pembeli'),
};
