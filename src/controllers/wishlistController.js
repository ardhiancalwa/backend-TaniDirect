const wishlistService = require("../services/wishlistService");

const getProdukWishlistByPembeliID = async (req, res, next) => {
  try {
    const { pembeliID } = req.params;
    const wishlist = await wishlistService.getProdukByPembeliID(pembeliID);
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Wishlist successfully found",
      data: wishlist,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        status: "error",
        statusCode: error.statusCode,
        message: error.message,
      });
    } else {
      next(error);
    }
  }
};

const addProdukToWishlist = async (req, res, next) => {
  try {
    await wishlistService.addToWishlist(req.body);
    res.status(201).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Produk added to wishlist successfully",
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        status: "error",
        statusCode: error.statusCode,
        message: error.message,
      });
    } else {
      next(error);
    }
  }
};

const deleteProdukFromWishlist = async (req, res, next) => {
  try {
    const { wishlistID } = req.params;
    await wishlistService.removeWishlistProduk(wishlistID);
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Produk deleted from wishlist successfully",
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        status: "error",
        statusCode: error.statusCode,
        message: error.message,
      });
    } else {
      next(error);
    }
  }
};

module.exports = {
  getProdukWishlistByPembeliID,
  addProdukToWishlist,
  deleteProdukFromWishlist,
}
