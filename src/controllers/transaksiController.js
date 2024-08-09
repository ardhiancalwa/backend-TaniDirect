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
        midtransToken: result.midtransToken,
        redirectUrl: result.redirect_url,
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

const generateTokenMidtrans = async (req, res, next) => {
  try {
    const result = await transaksiService.createTransaksiToken(req.body);
    res.status(201).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Token generated successfully",
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

    res.status(200).json({ message: "Notification received" });
  } catch (error) {
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
  createTransaksi,
  handleMidtransNotification,
  generateTokenMidtrans,
  getAllTransaksi,
  getTransaksiById,
  deleteTransaksi,
};
