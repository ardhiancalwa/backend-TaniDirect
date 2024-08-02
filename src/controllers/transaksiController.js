const transaksiService = require('../services/transaksiService');
const midtransClient = require('midtrans-client');

const createTransaksi = async (req, res, next) => {
  try {
    const result = await transaksiService.createTransaksi(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Transaksi berhasil dibuat',
      data: {
        transaksi: result.transaksi,``
        midtransToken : result.midtransToken,
        redirectUrl : result.redirect_url
      },
    });
  } catch (error) {
    next(error);
  }
};

const handleMidtransNotification = async (req, res, next) => {
  const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
  });

  try {
      const statusResponse = await snap.transaction.notification(req.body);
      const orderId = statusResponse.no_transaksi;
      const transactionStatus = statusResponse.status_transaksi;

      // Update transaction status in the database
      await prisma.transaksi.update({
          where: { no_transaksi: orderId },
          data: { status_transaksi: transactionStatus },
      });

      res.status(200).json({ message: 'Notification received' });
  } catch (error) {
      next(error);
  }
};

const getAllTransaksi = async (req, res, next) => {
  try {
    const result = await transaksiService.getAllTransaksi();
    res.status(200).json({
      status: 'success',
      message: 'Transaksi berhasil ditemukan',
      data: result,
    });
  } catch (error) {
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
  handleMidtransNotification,
  getAllTransaksi,
  getTransaksiById,
  updateTransaksi,
  deleteTransaksi,
};
