const express = require("express");
const router = express.Router();
const pembeliController = require("../controllers/pembeliController");
const { registerPembeli } = require("../controllers/pembeliController"); 
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
  upload.single('image_pembeli'),
  async (req, res, next) => {
    req.body.image_pembeli = req.file ? req.file.path : null;
    registerPembeli(req, res, next);
  }
);
router.post("/login", pembeliController.loginPembeli);

router.get(
  "/",
  passport.authenticate("jwt-pembeli", { session: false }),
  pembeliController.getAllPembeli
);
router.get(
  "/:pembeliID",
  passport.authenticate("jwt-pembeli", { session: false }),
  pembeliController.getPembeliById
);
router.put(
  "/:pembeliID",
  passport.authenticate("jwt-pembeli", { session: false }),
  pembeliController.updatePembeli
);
router.delete(
  "/:pembeliID",
  passport.authenticate("jwt-pembeli", { session: false }),
  pembeliController.deletePembeli
);

module.exports = router;
