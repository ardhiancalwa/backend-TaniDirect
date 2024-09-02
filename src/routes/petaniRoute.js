// routes/petaniRoutes.js
const express = require("express");
const router = express.Router();
const petaniController = require("../controllers/petaniController");
const { registerPetani } = require("../controllers/petaniController"); 
// const passport = require("../middlewares/auth");
const multer = require('multer');
const cloudinary = require("../utils/cloudinary");
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user',
    // format: async (req, file) => 'jpg', // mendukung penggunaan promise
    public_id: (req, file) => Date.now() + '-' + Math.round(Math.random() * 1e9),
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
