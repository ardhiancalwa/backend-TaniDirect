const Wishlist = require("../models/wishlistModel");
const {
  ValidationError,
  NotFoundError,
  InternalServerError,
} = require("../middlewares/errorHandler");

const getProdukByPembeliID = async (pembeliID) => {
  const wishlist = await Wishlist.findByPembeliID(pembeliID);
  if (!wishlist || wishlist.length === 0) {
    throw new NotFoundError("Wishlist not found");
  }
  return wishlist;
};

const addToWishlist = async (items) => {
  if (!items.pembeliID) {
    throw new ValidationError("Pembeli ID is required");
  }
  const addProduk = await Wishlist.addProduk(items);
  if (!addProduk) {
    throw new InternalServerError("Failed to add product to wishlist");
  }
  return addProduk;
};

const removeWishlistProduk = async (wishlistID) => {
  const wishlist = await Wishlist.removeProduk(wishlistID);
  if (!wishlist) {
    throw new NotFoundError("Wishlist not found");
  }
  return wishlist;
};

module.exports = {
  getProdukByPembeliID,
  addToWishlist,
  removeWishlistProduk,
};
