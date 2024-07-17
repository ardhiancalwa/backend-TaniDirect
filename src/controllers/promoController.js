const promoService = require('../services/promoService');

const getAllPromo = async (req, res, next) => {
  try {
    const promo = await promoService.getAllPromo();
    res.status(200).json({
      status: 'success',
      message: 'Promo berhasil ditemukan',
      data: promo,
    });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

const addPromo = async (req, res, next) => {
  try {
    const newPromo = await promoService.addPromo(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Promo berhasil ditambahkan',
      data: newPromo,
    });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

const getPromoByName = async (req, res, next) => {
  try {
    const { nama_promo } = req.params;
    const promo = await promoService.getPromoByName(nama_promo);
    res.status(200).json({
      status: 'success',
      message: 'Promo berhasil ditemukan',
      data: promo,
    });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

const updatePromo = async (req, res, next) => {
  try {
    const { nama_promo } = req.params;
    const updatedPromo = await promoService.updatePromo(nama_promo, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Promo berhasil diupdate',
      data: updatedPromo,
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

const deletePromo = async (req, res, next) => {
  try {
    const { nama_promo } = req.params;
    await promoService.deletePromo(nama_promo);
    res.status(200).json({
      status: 'success',
      message: 'Promo berhasil dihapus',
    });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  getAllPromo,
  addPromo,
  getPromoByName,
  updatePromo,
  deletePromo,
};
