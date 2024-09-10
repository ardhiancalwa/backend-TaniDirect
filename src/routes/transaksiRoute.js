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
  authenticatePembeli,
  transaksiController.handleMidtransNotification
);
// router.post("/generate-token", transaksiController.generateTokenMidtrans);
router.post("/", authenticatePembeli, transaksiController.createTransaksi);
router.get("/", authenticateAny, transaksiController.getAllTransaksi);
router.get(
  "/:no_transaksi",
  authenticateAny,
  transaksiController.getTransaksiById
);
router.get(
  "/pembeli/:pembeliID/produk",
  authenticatePembeli,
  transaksiController.getProdukByPembeliId
);

router.get(
  "/recomendations/top-selling-products",
  authenticateAny,
  transaksiController.getRecomendationProductByTotalSold
);

router.delete(
  "/:no_transaksi",
  authenticatePembeli,
  transaksiController.deleteTransaksi
);

module.exports = router;
