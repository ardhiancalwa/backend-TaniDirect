const express = require("express");
const passport = require("../middlewares/auth");
const {
  getAllKategori,
  addKategori,
  getKategoriById,
  updateKategori,
  deleteKategori,
} = require("../controllers/kategoriController");

const router = express.Router();

router.get(
  "/",
  passport.authenticate("jwt-petani", { session: false }),
  getAllKategori
);
router.post(
  "/",
  passport.authenticate("jwt-petani", { session: false }),
  addKategori
);
router.get(
  "/:kategoriID",
  passport.authenticate("jwt-petani", { session: false }),
  getKategoriById
);
router.put(
  "/kategori/:kategoriID",
  passport.authenticate("jwt-petani", { session: false }),
  updateKategori
);
router.delete(
  "/kategori/:kategoriID",
  passport.authenticate("jwt-petani", { session: false }),
  deleteKategori
);

module.exports = router;
