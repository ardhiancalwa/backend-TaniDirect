  const Produk = require("../models/produkModel");

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
      throw new Error("Data tidak ditemukan");
    }

    try {
      produk.forEach((item) => {
        item.image_produk = item.image_produk
          ? item.image_produk.replace(/\\/g, "/")
          : null;
      });
    } catch (error) {
      console.error(error);
      throw new Error("Gagal mengolah data produk");
    }
    return produk;
  };

  const addProduk = async (produkData) => {
    if (!produkData.petaniID) {
      throw new Error("ID petani diperlukan untuk menambahkan produk");
    }
    const newProduk = await Produk.create({
      nama_produk: produkData.nama_produk,
      deskripsi_produk: produkData.deskripsi_produk,
      image_produk: `${produkData.image_produk.replace(/\\/g, '/')}`,
      harga: parseFloat(produkData.harga),
      jumlah_stok: parseInt(produkData.jumlah_stok, 10),
      petaniID: produkData.petaniID,
    });
    return newProduk;
  };

  const searchProduk = async (nama_produk) => {
    const produk = await Produk.findByName(nama_produk);
    if (produk.length === 0) {
      throw new Error("Produk tidak ditemukan");
    }
    return produk;
  };

  const getProdukById = async (produkID) => {
    const produk = await Produk.findById(produkID);
    if (!produk) {
      throw new Error("Produk tidak ditemukan");
    }
    return produk;
  };

  const getProdukByPetaniId = async (petaniID) => {
    const produk = await Produk.findByPetaniId(petaniID);
    if (produk.length === 0) {
      throw new Error("Produk tidak ditemukan untuk petani ini");
    }
    return produk;
  };

  const updateProduk = async (produkID, updateData) => {
    const updatedProduk = await Produk.update(produkID, {
      nama_produk: updateData.nama_produk,
      deskripsi_produk: updateData.deskripsi_produk,
      image_produk: updateData.image_produk,
      harga: parseFloat(updateData.harga),
      jumlah_stok: parseInt(updateData.jumlah_stok, 10),
    });
    return updatedProduk;
  };

  const deleteProduk = async (produkID) => {
    await Produk.delete(produkID);
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
