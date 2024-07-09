const Kategori = require('../models/kategoriModel');

const getAllKategori = async () => {
  const data = await Kategori.findAll();
  if (data.length === 0) {
    throw new Error('Data tidak ditemukan');
  }
  return data;
};

const addKategori = async (kategoriData) => {
  const newKategori = await Kategori.create({
    nama_kategori: kategoriData.nama_kategori,
  });
  return newKategori;
};

const getKategoriById = async (kategoriID) => {
  const kategori = await Kategori.findById(kategoriID);
  if (!kategori) {
    throw new Error('Kategori tidak ditemukan');
  }
  return kategori;
};

const updateKategori = async (kategoriID, updateData) => {
  const updatedKategori = await Kategori.update(kategoriID, {
    nama_kategori: updateData.nama_kategori,
  });
  return updatedKategori;
};

const deleteKategori = async (kategoriID) => {
  await Kategori.delete(kategoriID);
};

module.exports = {
  getAllKategori,
  addKategori,
  getKategoriById,
  updateKategori,
  deleteKategori,
};
