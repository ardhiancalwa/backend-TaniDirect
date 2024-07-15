const transaksiService = require('../services/transaksiService');

const createTransaksi = async (req, res, next) => {
  try {
    const result = await transaksiService.createTransaksi(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Transaksi berhasil dibuat',
      data: result,
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(400).json({ status: 'error', message: error.message });
    next(error);
  }
};

const getAllTransaksi = async (req, res, next) => {
  try {
    const transaksi = await transaksiService.getAllTransaksi();
    res.status(200).json({
      status: 'success',
      message: 'Transaksi berhasil ditemukan',
      data: transaksi,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching transactions' });
    next(error);
  }
};

const getTransaksiById = async (req, res, next) => {
  const { no_transaksi } = req.params;

  try {
    const transaksi = await transaksiService.getTransaksiById(no_transaksi);
    res.status(200).json({
      status: 'success',
      message: 'Transaction berhasil ditemukan',
      data: transaksi,
    });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
    next(error);
  }
};

const updateTransaksi = async (req, res, next) => {
  const { no_transaksi } = req.params;

  try {
    const updatedTransaksi = await transaksiService.updateTransaksi(no_transaksi, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Transaction berhasil diperbarui',
      data: updatedTransaksi,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error updating transaction' });
    next(error);
  }
};

const deleteTransaksi = async (req, res, next) => {
  const { no_transaksi } = req.params;

  try {
    await transaksiService.deleteTransaksi(no_transaksi);
    res.status(200).json({
      status: 'success',
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ status: 'error', message: 'Error deleting transaction' });
    next(error);
  }
};

module.exports = {
  createTransaksi,  
  getAllTransaksi,
  getTransaksiById,
  updateTransaksi,
  deleteTransaksi,
};
