const express = require("express");
const router = express.Router();
const pembeliController = require("../controllers/pembeliController");
const { registerPembeli } = require("../controllers/pembeliController"); 
const { authenticatePembeli } = require('../middlewares/roleAuth');
const passport = require("../middlewares/auth");
const multer = require('multer');
const cloudinary = require("../utils/cloudinary");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   },
// });

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
  upload.single('image_pembeli'),
  async (req, res, next) => {
    req.body.image_pembeli = req.file ? req.file.path : null;
    registerPembeli(req, res, next);
  }
);
router.post("/login", pembeliController.loginPembeli);

router.get(
  "/",
  // authenticatePembeli,
  pembeliController.getAllPembeli
);
router.get(
  "/:pembeliID",
  // authenticatePembeli,
  pembeliController.getPembeliById
);
router.put(
  "/:pembeliID",
  // authenticatePembeli,
  upload.single('image_pembeli'),
  pembeliController.updatePembeli
);
router.delete(
  "/:pembeliID",
  // authenticatePembeli,
  pembeliController.deletePembeli
);

module.exports = router;
