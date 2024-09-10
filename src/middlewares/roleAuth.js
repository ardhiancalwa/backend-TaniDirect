const passport = require('passport');

const authenticateRole = (role) => {
  return (req, res, next) => {
    passport.authenticate(role, { session: false }, (err, user, info) => {
      console.log(`Authenticating role: ${role}`);
      if (err) {
        return next(err);
      }
      if (!user) {
        console.log('User not authenticated:', info);
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

const authenticateAny = (req, res, next) => {
  passport.authenticate(['jwt-pembeli', 'jwt-petani'], { session: false }, (err, user, info) => {
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

module.exports = {
  authenticatePetani: authenticateRole('jwt-petani'),
  authenticatePembeli: authenticateRole('jwt-pembeli'),
  authenticateAny: authenticateAny,
};
