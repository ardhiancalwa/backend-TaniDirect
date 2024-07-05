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
  '/',
  passport.authenticate('jwt-petani', { session: false }),
  upload.single('image_produk'),
  async (req, res, next) => {
    req.body.image_produk = req.file ? req.file.path : null;
    addProduk(req, res, next);
  }
);
