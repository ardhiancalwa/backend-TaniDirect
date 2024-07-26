const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'plisjuara'
};

passport.use(
  'jwt-petani',
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const petani = await prisma.petani.findUnique({ where: { petaniID: jwtPayload.id } });
      if (petani) {
        return done(null, petani);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

passport.use(
  'jwt-pembeli',
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const pembeli = await prisma.pembeli.findUnique({ where: { pembeliID: jwtPayload.id } });
      if (pembeli) {
        return done(null, pembeli);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

module.exports = passport;