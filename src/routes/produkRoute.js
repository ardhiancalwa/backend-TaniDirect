const express = require("express");
const router = express.Router();
const {authenticatePembeli, authenticatePetani, authenticateAny} = require("../middlewares/roleAuth");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const { CloudinaryStorage } = require('multer-storage-cloudinary');

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
  getAllProduk
);
router.post(
  "/",
  upload.array("image_produk", 7),
  async (req, res, next) => {
    const imageFileName = req.files.map(file => `/produk/${file.filename}`);
    req.body.image_produk = imageFileName.join(',');
    addProduk(req, res, next);
  }
);
router.get(
  "/search",
  searchProduk
);
router.get(
  "/:produkID",
  getProdukById
);
router.put(
  "/:produkID",
  upload.array("image_produk", 7),
  async (req, res, next) => {
    const imageFileName = req.files.map(file => `/produk/${file.filename}`);
    req.body.image_produk = imageFileName.join(',');
    updateProduk(req, res, next);
  }
);
router.get(
  "/petani/:petaniID",
  getProdukByPetaniId
);
router.delete(
  "/:produkID",
  deleteProduk
);

module.exports = router;
