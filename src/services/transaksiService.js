const {
  ValidationError,
  InternalServerError,
  NotFoundError,
} = require("../middlewares/errorHandler");
const { findById } = require('../models/pembeliModel');
const Transaksi = require("../models/transaksiModel");

// const createTransaksi = async (data) => {
//   const { produkID } = data;
//   if (!produkID) {
//     throw new ValidationError("produkID is required");
//   }
//   if (
//     !Array.isArray(produkID) ||
//     produkID.some((item) => !item.produkID || !item.jumlah)
//   ) {
//     throw new ValidationError(
//       "produkID must be an array of objects with produkID and jumlah"
//     );
//   }

//   try {
//     const newTransaksi = await Transaksi.create(data, produkID);
//     return newTransaksi;
//   } catch (error) {
//     throw new InternalServerError(
//       error.message
//     );
//   }
// };

// const createTransaksiToken = async (data) => {
//   try {
//     const pembeli = await findById(data.pembeliID);

//     if (!pembeli) {
//       throw new InternalServerError(
//         `Pembeli with ID ${data.pembeliID} not found`
//       );
//     }

//     const tokenData = await Transaksi.createTokenMidtrans(pembeli, data.totalHarga);

//     if (!tokenData) {
//       throw new InternalServerError("Failed to generate token");
//     }

//     return tokenData;
//   } catch (error) {
//     throw new InternalServerError(
//       `Failed to generate transaction token: ${error.message}`
//     );
//   }
// };

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
    const newTransaksi = await Transaksi.createAndGenerateToken(data, produkID);
    return newTransaksi;
  } catch (error) {
    throw new InternalServerError(error.message);
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

const getProdukByPembeliId = async (pembeliID) => {
  const transaksi = await Transaksi.findProdukByPembeliId(pembeliID);

  if (transaksi.length === 0) {
    throw new NotFoundError("Produk tidak ditemukan untuk pembeli ini.");
  }

  // Menggabungkan semua produk dari setiap transaksi
  const transaksiWithProduk = transaksi.map((trx) => ({
    no_transaksi: trx.no_transaksi,
    tanggal_transaksi: trx.tanggal_transaksi,
    status_transaksi: trx.status_transaksi,
    total_harga: trx.total_harga,
    metode_pembayaran: trx.metode_pembayaran,
    produk_dibeli: trx.TransaksiProduk.map((tp) => ({
      produkID: tp.produkID,
      nama_produk: tp.Produk.nama_produk,
      harga: tp.Produk.harga,
      berat_produk: tp.berat_produk,
      jumlah: tp.jumlah,
      deskripsi_produk: tp.Produk.deskripsi_produk,
      image_produk: tp.Produk.image_produk,
    })),
  }));

  return transaksiWithProduk;
};

const getRecomendationProductByTotalSold = async (totalSold) => {
  const produk = await Transaksi.findRecomendationsProdukbyTotalSold(totalSold);
  if (produk.length === 0) {
    throw new NotFoundError("Produk rekomendasi tidak ditemukan.");
  }
  return produk;
}

const deleteTransaksi = async (no_transaksi) => {
  const transaksi = await Transaksi.findById(no_transaksi);
  if (!transaksi) {
    throw new NotFoundError("Transaction not found");
  }
  await Transaksi.delete(no_transaksi);
};

module.exports = {
  // createTransaksi,
  // createTransaksiToken,
  createTransaksi,
  getAllTransaksi,
  getTransaksiById,
  getProdukByPembeliId,
  getRecomendationProductByTotalSold,
  deleteTransaksi,
};
