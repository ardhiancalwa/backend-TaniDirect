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

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadPath = path.join(process.cwd(), "src/tmp/");
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const fileName =
//       file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
//     cb(null, fileName);
//   },
// });

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
  upload.single("image_produk"),
  async (req, res, next) => {
    req.body.image_produk = req.file ? req.file.filename : null;
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
  upload.single("image_produk"),
  async (req, res, next) => {
    req.body.image_produk = req.file ? req.file.path : null;
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
