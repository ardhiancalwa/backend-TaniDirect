const express = require("express");
const router = express.Router();
const transaksiController = require("../controllers/transaksiController");
const {
  authenticatePembeli,
  authenticateAny,
} = require("../middlewares/roleAuth");
// router.post(
//   "/",
//   // passport.authenticate("jwt-pembeli", { session: false }),
//   transaksiController.createTransaksi
// );
router.post(
  "/midtrans-notification",
  transaksiController.handleMidtransNotification
);
// router.post("/generate-token", transaksiController.generateTokenMidtrans);
router.post("/", transaksiController.createTransaksi);
router.get("/", transaksiController.getAllTransaksi);
router.get(
  "/:no_transaksi",
  transaksiController.getTransaksiById
);
router.get(
  "/pembeli/:pembeliID/produk",
  transaksiController.getProdukByPembeliId
);

router.get(
  "/recomendations/top-selling-products",
  transaksiController.getRecomendationProductByTotalSold
);

router.delete(
  "/:no_transaksi",
  transaksiController.deleteTransaksi
);

module.exports = router;
