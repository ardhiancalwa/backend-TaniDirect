const multer = require('multer');
const path = require('path');
const express = require('express');
const passport = require('../../src/middlewares/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Adjusted destination path
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post(
  '/uploads',
  passport.authenticate('jwt-petani', { session: false }),
  upload.single('image_produk'),
  (req, res) => {
    res.status(200).json({ message: 'File uploaded successfully' });
  }
);

module.exports = router;
