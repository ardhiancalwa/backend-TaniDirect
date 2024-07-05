const express = require("express");
const router = express.Router();
const passport = require("../middlewares/auth");
const multer = require('multer');
const path = require('path');

const {
  getAllProduk,
  addProduk,
  searchProduk,
  getProdukById,
  updateProduk,
  deleteProduk,
} = require("../controllers/produkController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get(
  "/",
  passport.authenticate("jwt-petani", { session: false }),
  getAllProduk
);
router.post(
  "/",
  passport.authenticate("jwt-petani", { session: false }),
  upload.single('image_produk'),
  async (req, res, next) => {
    req.body.image_produk = req.file ? req.file.path : null;
    addProduk(req, res, next);
  }
);
router.get(
  "/search",
  passport.authenticate(["jwt-petani", "jwt-pembeli"], { session: false }),
  searchProduk
);
router.get(
  "/:produkID",
  passport.authenticate("jwt-petani", { session: false }),
  getProdukById
);
router.put(
  "/:produkID",
  passport.authenticate("jwt-petani", { session: false }),
  updateProduk
);
router.delete(
  "/:produkID",
  passport.authenticate("jwt-petani", { session: false }),
  deleteProduk
);

module.exports = router;
