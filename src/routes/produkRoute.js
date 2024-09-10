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
  authenticateAny,
  getAllProduk
);
router.post(
  "/",
  authenticatePetani,
  upload.array("image_produk", 7),
  async (req, res, next) => {
    const imageFileName = req.files.map(file => `/produk/${file.filename}`);
    req.body.image_produk = imageFileName.join(',');
    addProduk(req, res, next);
  }
);
router.get(
  "/search",
  authenticateAny,
  searchProduk
);
router.get(
  "/:produkID",
  authenticateAny,
  getProdukById
);
router.put(
  "/:produkID",
  authenticatePetani,
  upload.array("image_produk", 7),
  async (req, res, next) => {
    const imageFileName = req.files.map(file => `/produk/${file.filename}`);
    req.body.image_produk = imageFileName.join(',');
    updateProduk(req, res, next);
  }
);
router.get(
  "/petani/:petaniID",
  authenticateAny,
  getProdukByPetaniId
);
router.delete(
  "/:produkID",
  authenticatePetani,
  deleteProduk
);

module.exports = router;
