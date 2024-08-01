// routes/petaniRoutes.js
const express = require("express");
const router = express.Router();
const petaniController = require("../controllers/petaniController");
const { registerPetani } = require("../controllers/petaniController"); 
const passport = require("../middlewares/auth");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post(
  "/register",
  upload.single('image_petani'),
  async (req, res, next) => {
    req.body.image_petani = req.file ? req.file.path : null;
    registerPetani(req, res, next);
  }
);
router.post("/login", petaniController.loginPetani);

router.get(
  "/",
  // passport.authenticate("jwt-petani", { session: false }),
  petaniController.getAllPetani
);
router.get(
  "/:petaniID",
  // passport.authenticate("jwt-petani", { session: false }),
  petaniController.getPetaniById
);

router.put(
  "/:petaniID",
  // passport.authenticate("jwt-petani", { session: false }),
  upload.single('image_petani'),
  petaniController.updatePetani
);
router.delete(
  "/:petaniID",
  // passport.authenticate("jwt-petani", { session: false }),
  petaniController.deletePetani
);

module.exports = router;
