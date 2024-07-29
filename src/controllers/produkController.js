const produkService = require('../services/produkService');

const getAllProduk = async (req, res, next) => {
  try {
    const { sort, order } = req.query;
    const produk = await produkService.getAllProduk(sort, order);
    res.status(200).json({
      status: 'success',
      message: 'Daftar produk',
      data: produk,
    });
  } catch (error) {
    next(error);
  }
};

const addProduk = async (req, res, next) => {
  try {
    const newProduk = await produkService.addProduk(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Produk berhasil ditambahkan',
      data: newProduk,
    });
  } catch (error) {
    next(error);
  }
};

const searchProduk = async (req, res, next) => {
  try {
    const { nama_produk } = req.query;
    const produk = await produkService.searchProduk(nama_produk);
    res.status(200).json({
      status: 'success',
      message: 'Daftar produk yang ditemukan',
      data: produk,
    });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

const getProdukById = async (req, res, next) => {
  try {
    const { produkID } = req.params;
    const produk = await produkService.getProdukById(produkID);
    res.status(200).json({
      status: 'success',
      message: 'Data produk berhasil ditemukan',
      data: produk,
    });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

const updateProduk = async (req, res, next) => {
  try {
    const { produkID } = req.params;
    const updatedProduk = await produkService.updateProduk(produkID, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Produk berhasil diupdate',
      data: updatedProduk,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduk = async (req, res, next) => {
  try {
    const { produkID } = req.params;
    await produkService.deleteProduk(produkID);
    res.status(200).json({
      status: 'success',
      message: 'Produk berhasil dihapus',
    });
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ status: 'error', message: 'Produk tidak ditemukan' });
    }
    next(error);
  }
};

module.exports = {
  getAllProduk,
  addProduk,
  searchProduk,
  getProdukById,
  updateProduk,
  deleteProduk,
};
