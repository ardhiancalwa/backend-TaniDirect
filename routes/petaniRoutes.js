// routes/petaniRoutes.js
const express = require('express');
const router = express.Router();
const petaniController = require('../controllers/petaniController');
const passport = require('../middlewares/auth');

router.post('/petani/register', petaniController.registerPetani);
router.post('/petani/login', petaniController.loginPetani);

router.get('/petani', passport.authenticate('jwt', { session: false }), petaniController.getAllPetani);
// router.post('/petani', passport.authenticate('jwt', { session: false }), petaniController.createPetani);
router.get('/petani/:petaniID', passport.authenticate('jwt', { session: false }), petaniController.getPetaniById);
router.put('/petani/:petaniID', passport.authenticate('jwt', { session: false }), petaniController.updatePetani);
router.delete('/petani/:petaniID', passport.authenticate('jwt', { session: false }), petaniController.deletePetani);

module.exports = router;
