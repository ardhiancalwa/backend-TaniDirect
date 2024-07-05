const express = require('express');
const passport = require('../middlewares/auth');
const {
  getAllPromo,
  addPromo,
  getPromoByNama,
  updatePromo,
  deletePromo,
} = require('../controllers/promoController');

const router = express.Router();

router.get(
  '/',
  passport.authenticate('jwt-pembeli', { session: false }),
  getAllPromo
);
router.post(
  '/',
  passport.authenticate('jwt-pembeli', { session: false }),
  addPromo
);
router.get(
  '/:nama_promo',
  passport.authenticate('jwt-pembeli', { session: false }),
  getPromoByNama
);
router.put(
  '/:nama_promo',
  passport.authenticate('jwt-pembeli', { session: false }),
  updatePromo
);
router.delete(
  '/:nama_promo',
  passport.authenticate('jwt-pembeli', { session: false }),
  deletePromo
);

module.exports = router;
