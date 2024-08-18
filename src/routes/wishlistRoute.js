const express = require("express");
const {
  getProdukWishlistByPembeliID,
  addProdukToWishlist,
  deleteProdukFromWishlist,
} = require("../controllers/wishlistController");
const router = express.Router();

router.get("/:pembeliID", getProdukWishlistByPembeliID);
router.post("/", addProdukToWishlist);
router.delete("/:wishlistID", deleteProdukFromWishlist);

module.exports = router;
