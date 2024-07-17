const kategoriService = require('../services/kategoriService');

const getAllKategori = async (req, res, next) => {
  try {
    const data = await kategoriService.getAllKategori();
    res.status(200).json({
      status: 'success',
      message: 'Data kategori berhasil ditemukan',
      data,
    });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

const addKategori = async (req, res, next) => {
  try {
    const newKategori = await kategoriService.addKategori(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Kategori berhasil ditambahkan',
      data: newKategori,
    });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

const getKategoriById = async (req, res, next) => {
  try {
    const { kategoriID } = req.params;
    const kategori = await kategoriService.getKategoriById(kategoriID);
    res.status(200).json({
      status: 'success',
      message: 'Kategori berhasil ditemukan',
      data: kategori,
    });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

const updateKategori = async (req, res, next) => {
  try {
    const { kategoriID } = req.params;
    const updatedKategori = await kategoriService.updateKategori(kategoriID, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Kategori berhasil di update',
      data: updatedKategori,
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

const deleteKategori = async (req, res, next) => {
  try {
    const { kategoriID } = req.params;
    await kategoriService.deleteKategori(kategoriID);
    res.status(200).json({
      status: 'success',
      message: 'Kategori berhasil dihapus',
    });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  getAllKategori,
  addKategori,
  getKategoriById,
  updateKategori,
  deleteKategori,
};
