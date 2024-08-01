const Transaksi = require("../models/transaksiModel");

const createTransaksi = async (data) => {
  const { produkID } = data;
  if (
    !Array.isArray(produkID) ||
    produkID.some((item) => !item.produkID || !item.jumlah)
  ) {
    throw new Error(
      "produkID must be an array of objects with produkID and jumlah"
    );
  }

  const newTransaksi = await Transaksi.create(data, produkID);
  return newTransaksi;
};

const getAllTransaksi = async () => {
  return await Transaksi.findAll();
};

const getTransaksiById = async (no_transaksi) => {
  const transaksi = await Transaksi.findById(no_transaksi);
  if (!transaksi) {
    throw new Error("Transaction not found");
  }
  return transaksi;
};

const updateTransaksi = async (no_transaksi, data) => {
  const updatedTransaksi = await Transaksi.update(no_transaksi, data);
  return updatedTransaksi;
};

const deleteTransaksi = async (no_transaksi) => {
  await Transaksi.delete(no_transaksi);
};

module.exports = {
  createTransaksi,
  getAllTransaksi,
  getTransaksiById,
  updateTransaksi,
  deleteTransaksi,
};
