const multer = require('multer');
const path = require('path');
const express = require('express');
const passport = require('../../src/middlewares/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); 
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${timestamp}${extension}`);
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
