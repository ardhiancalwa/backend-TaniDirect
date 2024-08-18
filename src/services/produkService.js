const Produk = require("../models/produkModel");
const {
  ValidationError,
  NotFoundError,
  InternalServerError,
} = require("../middlewares/errorHandler");

const getAllProduk = async (sort, order) => {
  const validSortFields = [
    "nama_produk",
    "deskripsi_produk",
    "image_produk",
    "harga",
    "jumlah_stok",
    "createdAt",
    "updatedAt",
  ];
  const sortField = validSortFields.includes(sort) ? sort : "nama_produk";
  const sortOrder = order === "desc" ? "desc" : "asc";

  const produk = await Produk.findAll({
    orderBy: {
      [sortField]: sortOrder,
    },
  });
  if (produk.length === 0) {
    throw new NotFoundError("Data not found");
  }

  try {
    produk.forEach((item) => {
      item.image_produk = item.image_produk.map((image) =>
        image.replace(/\\/g, "/")
      );
    });
  } catch (error) {
    throw new InternalServerError("Failed to process product data");
  }
  return produk;
};

const addProduk = async (produkData) => {
  if (!produkData.petaniID) {
    throw new ValidationError("Farmer ID is required to add products");
  }
  const imagePaths = produkData.image_produk.map((url) => {
    // Ambil hanya path setelah "/produk/"
    const path = url.split("/").slice(-2).join("/");
    return path;
  });
  const newProduk = await Produk.create({
    nama_produk: produkData.nama_produk,
    deskripsi_produk: produkData.deskripsi_produk,
    image_produk: imagePaths,
    harga: parseFloat(produkData.harga),
    jumlah_stok: parseInt(produkData.jumlah_stok, 10),
    jumlah_produk: produkData.jumlah_produk || 1,
    berat_produk: produkData.berat_produk || 20,
    petaniID: produkData.petaniID,
  });
  return newProduk;
};

const searchProduk = async (nama_produk) => {
  const produk = await Produk.findByName(nama_produk);
  if (produk.length === 0) {
    throw new NotFoundError("Product not found");
  }
  return produk;
};

const getProdukById = async (produkID) => {
  const produk = await Produk.findById(produkID);
  if (!produk) {
    throw new NotFoundError("Product not found");
  }
  return produk;
};

const getProdukByPetaniId = async (petaniID) => {
  const produk = await Produk.findByPetaniId(petaniID);
  if (produk.length === 0) {
    throw new NotFoundError("No products found for this farmer");
  }
  return produk;
};

const updateProduk = async (produkID, updateData) => {
  const produk = await Produk.findById(produkID);
  if (!produk) {
    throw new NotFoundError("Product not found");
  }

  const imagePaths = updateData.image_produk.map((url) => {
    const path = url.split("/").slice(-2).join("/");
    return path;
  });
  const updatedProduk = await Produk.update(produkID, {
    nama_produk: updateData.nama_produk,
    deskripsi_produk: updateData.deskripsi_produk,
    image_produk: imagePaths,
    harga: parseFloat(updateData.harga),
    jumlah_stok: parseInt(updateData.jumlah_stok, 10),
    jumlah_produk: updateData.jumlah_produk,
    berat_produk: updateData.berat_produk,
  });
  return updatedProduk;
};

const deleteProduk = async (produkID) => {
  const produk = await Produk.delete(produkID);
  if (!produk) {
    throw new NotFoundError("Product not found");
  }
};

module.exports = {
  getAllProduk,
  addProduk,
  searchProduk,
  getProdukById,
  getProdukByPetaniId,
  updateProduk,
  deleteProduk,
};
