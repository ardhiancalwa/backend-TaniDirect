const express = require("express");
const router = express.Router();
const passport = require("../middlewares/auth");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const path = require("path");

const {
  getAllProduk,
  addProduk,
  searchProduk,
  getProdukById,
  updateProduk,
  deleteProduk,
  getProdukByPetaniId,
} = require("../controllers/produkController");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'produk',
    // format: async (req, file) => 'jpg', // mendukung penggunaan promise
    public_id: (req, file) => Date.now() + '-' + Math.round(Math.random() * 1e9),
  },
});

const upload = multer({ storage: storage });

router.get(
  "/",
  // passport.authenticate(["jwt-petani", "jwt-pembeli"], { session: false }),
  getAllProduk
);
router.post(
  "/",
  // passport.authenticate("jwt-petani", { session: false }),
  upload.array("image_produk", 7),
  async (req, res, next) => {
    const imageFileName = req.files.map(file => `/produk/${file.filename}`);
    req.body.image_produk = imageFileName.join(',');
    addProduk(req, res, next);
  }
);
router.get(
  "/search",
  // passport.authenticate(["jwt-petani", "jwt-pembeli"], { session: false }),
  searchProduk
);
router.get(
  "/:produkID",
  // passport.authenticate("jwt-petani", { session: false }),
  getProdukById
);
router.put(
  "/:produkID",
  // passport.authenticate("jwt-petani", { session: false }),
  upload.array("image_produk", 7),
  async (req, res, next) => {
    const imageFileName = req.files.map(file => `/produk/${file.filename}`);
    req.body.image_produk = imageFileName.join(',');
    updateProduk(req, res, next);
  }
);
router.get(
  "/petani/:petaniID",
  // passport.authenticate("jwt-petani", { session: false }),
  getProdukByPetaniId
);
router.delete(
  "/:produkID",
  // passport.authenticate("jwt-petani", { session: false }),
  deleteProduk
);

module.exports = router;
