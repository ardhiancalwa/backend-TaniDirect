const Keranjang = require("../models/keranjangModel");

const getAllCartProduct = async () => {
  const keranjang = await Keranjang.findAll();
  if (keranjang.length === 0) {
    throw new NotFoundError("Keranjang kosong.");
  }
  return keranjang;
};

const addCartItems = async (keranjangData) => {};

module.exports = {
  getAllCartProduct,
};
