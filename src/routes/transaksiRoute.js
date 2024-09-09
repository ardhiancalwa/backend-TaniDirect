const express = require("express");
const router = express.Router();
const transaksiController = require("../controllers/transaksiController");
const passport = require("../middlewares/auth");

// router.post(
//   "/",
//   // passport.authenticate("jwt-pembeli", { session: false }),
//   transaksiController.createTransaksi
// );
router.post(
  "/midtrans-notification",
  // passport.authenticate("jwt-pembeli", { session: false }),
  transaksiController.handleMidtransNotification
);
// router.post("/generate-token", transaksiController.generateTokenMidtrans);
router.post("/", transaksiController.createTransaksi);
router.get(
  "/",
  // passport.authenticate("jwt-pembeli", { session: false }),
  transaksiController.getAllTransaksi
);
router.get(
  "/:no_transaksi",
  // passport.authenticate("jwt-pembeli", { session: false }),
  transaksiController.getTransaksiById
);
router.get(
  "/pembeli/:pembeliID/produk",
  // passport.authenticate("jwt-pembeli", { session: false }),
  transaksiController.getProdukByPembeliId
);

router.get(
  "/recomendations/top-selling-products",
  // passport.authenticate("jwt-pembeli", { session: false }),
  transaksiController.getRecomendationProductByTotalSold
)

router.delete(
  "/:no_transaksi",
  // passport.authenticate("jwt-pembeli", { session: false }),
  transaksiController.deleteTransaksi
);

module.exports = router;
