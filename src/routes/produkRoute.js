const express = require("express");
const router = express.Router();
const passport = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");

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
    const uploadPath = path.join(__dirname, "../uploads");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName =
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get(
  "/",
  passport.authenticate(["jwt-petani", "jwt-pembeli"], { session: false }),
  getAllProduk
);
router.post(
  "/",
  passport.authenticate("jwt-petani", { session: false }),
  upload.single("image_produk"),
  async (req, res, next) => {
    req.body.image_produk = req.file ? req.file.filename : null;
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
  upload.single("image_produk"),
  async (req, res, next) => {
    req.body.image_produk = req.file ? req.file.path : null;
    updateProduk(req, res, next);
  }
);
router.delete(
  "/:produkID",
  passport.authenticate("jwt-petani", { session: false }),
  deleteProduk
);

module.exports = router;
