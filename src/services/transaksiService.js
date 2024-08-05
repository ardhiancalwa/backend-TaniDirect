const {
  ValidationError,
  AuthenticationError,
  InternalServerError,
  NotFoundError,
} = require("../middlewares/errorHandler");
const Transaksi = require("../models/transaksiModel");

const createTransaksi = async (data) => {
  const { produkID } = data;
  if (!produkID) {
    throw new ValidationError("produkID is required");
  }
  if (
    !Array.isArray(produkID) ||
    produkID.some((item) => !item.produkID || !item.jumlah)
  ) {
    throw new ValidationError(
      "produkID must be an array of objects with produkID and jumlah"
    );
  }

  try {
    const newTransaksi = await Transaksi.create(data, produkID);
    return newTransaksi;
  } catch (error) {
    throw new InternalServerError(
      "An unexpected error occurred while creating the transaction"
    );
  }
};

const getAllTransaksi = async () => {
  const transaksi = await Transaksi.findAll();
  if (transaksi.length === 0) {
    throw new NotFoundError("Data not found");
  }
  return transaksi;
};

const getTransaksiById = async (no_transaksi) => {
  const transaksi = await Transaksi.findById(no_transaksi);
  if (!transaksi) {
    throw new NotFoundError("Transaction not found");
  }
  return transaksi;
};

const deleteTransaksi = async (no_transaksi) => {
  const transaksi = await Transaksi.findById(no_transaksi);
  if (!transaksi) {
    throw new NotFoundError("Transaction not found");
  }
  await Transaksi.delete(no_transaksi);
};

module.exports = {
  createTransaksi,
  getAllTransaksi,
  getTransaksiById,
  deleteTransaksi,
};
