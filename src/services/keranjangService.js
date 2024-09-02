const Keranjang = require("../models/keranjangModel");
const Produk = require("../models/produkModel");

const { NotFoundError } = require("../middlewares/errorHandler");

const getAllKeranjang = async () => {
  const keranjang = await Keranjang.findAll();
  if (keranjang.length === 0) {
    throw new NotFoundError("No carts found");
  }
  return keranjang;
};

const getKeranjangByPembeliId = async (pembeliID) => {
  const keranjang = await Keranjang.findByPembeliId(pembeliID);
  if (!keranjang) {
    throw new NotFoundError("Cart not found for this buyer");
  }
  return keranjang;
};

const addKeranjangProduk = async (pembeliID, produk) => {
  const produkFound = await Produk.findById(produk.produkID);

  if (!produkFound) {
    throw new NotFoundError("Produk tidak ditemukan");
  }

  const hargaProduk = produkFound.harga;
  const beratProduk = produkFound.berat_produk || 20;

  if (typeof hargaProduk !== "number" || typeof beratProduk !== "number") {
    throw new Error("Harga atau berat produk tidak valid");
  }

  const newKeranjangProduk = await Keranjang.addProdukToKeranjang(
    pembeliID,
    produk.produkID,
    produk.jumlah
  );

  return newKeranjangProduk;
};

const updateKeranjangProduk = async (keranjangID, produkID, jumlah) => {
  const produk = await Produk.findById(produkID);
  if (!produk) {
    throw new NotFoundError("Produk tidak ditemukan");
  }

  const hargaProduk = produk.harga;
  const beratProduk = produk.berat_produk || 20;
  const totalHargaProduk = hargaProduk * beratProduk * jumlah;

  const updatedKeranjangProduk = await Keranjang.update(keranjangID, {
    produk: [
      {
        produkID: produkID,
        jumlah: jumlah,
        total_harga_produk: totalHargaProduk,
      },
    ],
  });

  return updatedKeranjangProduk;
};

const deleteKeranjang = async (keranjangID) => {
  const keranjang = await Keranjang.delete(keranjangID);
  if (!keranjang) {
    throw new NotFoundError("Cart not found");
  }
};

module.exports = {
  getAllKeranjang,
  getKeranjangByPembeliId,
  addKeranjangProduk,
  updateKeranjangProduk,
  deleteKeranjang,
};
