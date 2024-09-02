const Produk = require("../models/produkModel");
const {
  ValidationError,
  NotFoundError,
  InternalServerError,
} = require("../middlewares/errorHandler");
const Joi = require("joi");

const updateProdukSchema = Joi.object({
  nama_produk: Joi.string().optional(),
  deskripsi_produk: Joi.string().optional(),
  image_produk: Joi.array().items(Joi.string()).optional(),
  harga: Joi.number().positive().optional(),
  jumlah_stok: Joi.number().integer().min(1).optional(),
  petaniID: Joi.number().integer().optional(),
  berat_produk: Joi.number().integer().valid(20, 50, 75, 100).optional(),
  jumlah_produk: Joi.number().integer().min(1).optional(),
});

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
  /* 
  Opsi { abortEarly: false } berarti bahwa validasi tidak akan berhenti setelah menemukan kesalahan pertama.
   Sebaliknya, semua kesalahan validasi akan dikumpulkan dan dilaporkan sekaligus.
  */
  const { error, value } = updateProdukSchema.validate(updateData, {
    abortEarly: false,
  });

  if (error) {
    throw new InternalServerError(
      `Validation error: ${error.details.map((x) => x.message).join(", ")}`
    );
  }

  const produk = await Produk.findById(produkID);
  if (!produk) {
    throw new NotFoundError("Product not found");
  }

  const imagePaths = value.image_produk
    ? value.image_produk.map((url) => {
        const path = url.split("/").slice(-2).join("/");
        return path;
      })
    : produk.image_produk;

  const updateFields = {
    nama_produk: value.nama_produk ?? produk.nama_produk,
    deskripsi_produk: value.deskripsi_produk ?? produk.deskripsi_produk,
    image_produk: imagePaths,
    harga: value.harga !== undefined ? parseFloat(value.harga) : produk.harga,
    jumlah_stok:
      value.jumlah_stok !== undefined
        ? parseInt(value.jumlah_stok, 10)
        : produk.jumlah_stok,
    jumlah_produk: value.jumlah_produk ?? produk.jumlah_produk,
    berat_produk: value.berat_produk ?? produk.berat_produk,
  };

  const updatedProduk = await Produk.update(produkID, updateFields);

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
