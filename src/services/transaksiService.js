const {
  ValidationError,
  AuthenticationError,
  InternalServerError,
  NotFoundError,
} = require("../middlewares/errorHandler");
const { findById } = require('../models/pembeliModel');
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
      // "An unexpected error occurred while creating the transaction"
      error.message
    );
  }
};

const createTransaksiToken = async (data) => {
  try {
    const pembeli = await findById(data.pembeliID);

    if (!pembeli) {
      throw new InternalServerError(
        `Pembeli with ID ${data.pembeliID} not found`
      );
    }

    const tokenData = await Transaksi.createTokenMidtrans(pembeli, data.totalHarga);

    if (!tokenData) {
      throw new InternalServerError("Failed to generate token");
    }

    return tokenData;
  } catch (error) {
    throw new InternalServerError(
      `Failed to generate transaction token: ${error.message}`
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
  createTransaksiToken,
  getAllTransaksi,
  getTransaksiById,
  deleteTransaksi,
};
