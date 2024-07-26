const Produk = require('../models/produkModel');

const getAllProduk = async (sort, order) => {
  const validSortFields = [
    'nama_produk',
    'deskripsi_produk',
    'image_produk',
    'harga',
    'jumlah_stok',
    'createdAt',
    'updatedAt',
  ];
  const sortField = validSortFields.includes(sort) ? sort : 'nama_produk';
  const sortOrder = order === 'desc' ? 'desc' : 'asc';
  
  const produk = await Produk.findAll({
    orderBy: {
      [sortField]: sortOrder,
    },
  });
  if (produk.length === 0) {
    throw new Error('Data tidak ditemukan');
  }
  return produk;
};


const addProduk = async (produkData) => {
  const newProduk = await Produk.create({
      nama_produk: produkData.nama_produk,
      deskripsi_produk: produkData.deskripsi_produk,
      image_produk: produkData.image_produk,
      harga: parseFloat(produkData.harga),
      jumlah_stok: parseInt(produkData.jumlah_stok, 10),
  });
  return newProduk;
};


const searchProduk = async (nama_produk) => {
  const produk = await Produk.findByName({
    where: {
      nama_produk: {
        contains: nama_produk,
        mode: 'insensitive',
      },
    },
  });
  if (produk.length === 0) {
    throw new Error('Produk tidak ditemukan');
  }
  return produk;
};


const getProdukById = async (produkID) => {
  const produk = await Produk.findById({
    where: {
      produkID: parseInt(produkID, 10),
    },
  });
  if (!produk) {
    throw new Error('Produk tidak ditemukan');
  }
  return produk;
};


const updateProduk = async (produkID, updateData) => {
  const updatedProduk = await Produk.update({
    where: {
      produkID: parseInt(produkID, 10),
    },
    data: {
      nama_produk: updateData.nama_produk,
      deskripsi_produk: updateData.deskripsi_produk,
      image_produk: updateData.image_produk,
      harga: parseFloat(updateData.harga),
      jumlah_stok: parseInt(updateData.jumlah_stok, 10),
    },
  });
  return updatedProduk;
};

const deleteProduk = async (produkID) => {
  await Produk.delete({
    where: {
      produkID: parseInt(produkID, 10),
    },
  });
};

module.exports = {
  getAllProduk,
  addProduk,
  searchProduk,
  getProdukById,
  updateProduk,
  deleteProduk,
};
