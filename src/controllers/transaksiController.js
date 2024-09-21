const transaksiService = require("../services/transaksiService");
const midtransClient = require("midtrans-client");

const createTransaksi = async (req, res, next) => {
  try {
    const result = await transaksiService.createTransaksi(req.body);
    res.status(201).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Transaction successfully created",
      data: {
        transaksi: result.transaksi,
        midtransToken: result.midtrans.midtransToken,
        redirectUrl: result.midtrans.redirect_url,
      },
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        status: "error",
        statusCode: error.statusCode,
        message: error.message,
      });
    } else {
      next(error);
    }
  }
};

const handleMidtransNotification = async (req, res, next) => {
  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
  });

  try {
    const notification = req.body;

    // Ambil status dari Midtrans
    const statusResponse = await snap.transaction.notification(notification);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;

    let statusTransaksi;
    if (transactionStatus === 'capture') {
      // Untuk kartu kredit, bisa 'challenge' atau 'success'
      if (statusResponse.fraud_status === 'challenge') {
        statusTransaksi = 'challenge';
      } else if (statusResponse.fraud_status === 'accept') {
        statusTransaksi = 'success';
      }
    } else if (transactionStatus === 'settlement') {
      statusTransaksi = 'success';
    } else if (transactionStatus === 'deny') {
      statusTransaksi = 'denied';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'expire') {
      statusTransaksi = 'canceled';
    } else if (transactionStatus === 'pending') {
      statusTransaksi = 'pending';
    }

    // Update transaction status in the database
    await prisma.transaksi.update({
      where: { no_transaksi: orderId },
      data: { status_transaksi: statusTransaksi },
    });

    res.status(200).json({ message: "Notification received and processed" });
  } catch (error) {
    console.error("Error handling Midtrans notification", error);
    next(error);
  }
};


const getAllTransaksi = async (req, res, next) => {
  try {
    const result = await transaksiService.getAllTransaksi();
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Transactions successfully found",
      data: result,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        status: "error",
        statusCode: error.statusCode,
        message: error.message,
      });
    } else {
      next(error);
    }
  }
};

const getTransaksiById = async (req, res, next) => {
  const { no_transaksi } = req.params;

  try {
    const transaksi = await transaksiService.getTransaksiById(no_transaksi);
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Transaction successfully found",
      data: transaksi,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        status: "error",
        statusCode: error.statusCode,
        message: error.message,
      });
    } else {
      next(error);
    }
  }
};

const getProdukByPembeliId = async (req, res, next) => {
  const { pembeliID } = req.params;
  
  try {
    const produk = await transaksiService.getProdukByPembeliId(pembeliID);
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Produk yang dibeli berhasil ditemukan.",
      data: produk,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        status: "error",
        statusCode: error.statusCode,
        message: error.message,
      });
    } else {
      next(error);
    }
  }
};

const getRecomendationProductByTotalSold = async (req, res, next) => {
  try {
    const result = await transaksiService.getRecomendationProductByTotalSold();
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Rekomendasi produk berdasarkan total penjualan",
      data: result,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        status: "error",
        statusCode: error.statusCode,
        message: error.message,
      });
    } else {
      next(error);
    }
  }
} 

const deleteTransaksi = async (req, res, next) => {
  const { no_transaksi } = req.params;

  try {
    await transaksiService.deleteTransaksi(no_transaksi);
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        status: "error",
        statusCode: error.statusCode,
        message: error.message,
      });
    } else {
      next(error);
    }
  }
};

module.exports = {
  // createTransaksi,
  handleMidtransNotification,
  // generateTokenMidtrans,
  createTransaksi,
  getAllTransaksi,
  getTransaksiById,
  getProdukByPembeliId,
  getRecomendationProductByTotalSold,
  deleteTransaksi,
};
