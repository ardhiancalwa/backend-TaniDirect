const Promo = require('../models/promoModel');

const getAllPromo = async () => {
  const promo = await Promo.findAll();
  if (promo.length === 0) {
    throw new Error('Data tidak ditemukan');
  }
  return promo;
};

const addPromo = async (promoData) => {
  const newPromo = await Promo.create({
    nama_promo: promoData.nama_promo,
    deskripsi_promo: promoData.deskripsi_promo,
    tanggal_dimulai: new Date(promoData.tanggal_dimulai),
    tanggal_berakhir: new Date(promoData.tanggal_berakhir),
  });
  return newPromo;
};

const getPromoByName = async (nama_promo) => {
  const promo = await Promo.findByName(nama_promo);
  if (!promo) {
    throw new Error('Promo tidak ditemukan');
  }
  return promo;
};

const updatePromo = async (nama_promo, updateData) => {
  const updatedPromo = await Promo.update(nama_promo, {
    deskripsi_promo: updateData.deskripsi_promo,
    tanggal_dimulai: new Date(updateData.tanggal_dimulai),
    tanggal_berakhir: new Date(updateData.tanggal_berakhir),
  });
  return updatedPromo;
};

const deletePromo = async (nama_promo) => {
  await Promo.delete(nama_promo);
};

module.exports = {
  getAllPromo,
  addPromo,
  getPromoByName,
  updatePromo,
  deletePromo,
};
