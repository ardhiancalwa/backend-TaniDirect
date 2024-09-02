const express = require("express");
const router = express.Router();

const {
  getAllKeranjang,
  getKeranjangByPembeliId,
  addKeranjang,
  updateKeranjang,
  deleteKeranjang,
} = require("../controllers/keranjangController");

router.get("/", getAllKeranjang);
router.get("/:pembeliID", getKeranjangByPembeliId);
router.post("/", addKeranjang);
router.put("/:keranjangID", updateKeranjang);
router.delete("/:keranjangID", deleteKeranjang);

module.exports = router;
