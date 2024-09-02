const keranjangService = require("../services/keranjangService");

const getAllKeranjang = async (req, res, next) => {
  try {
    const keranjang = await keranjangService.getAllKeranjang();
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Carts successfully found",
      data: keranjang,
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

const getKeranjangByPembeliId = async (req, res, next) => {
  try {
    const { pembeliID } = req.params;
    const keranjang = await keranjangService.getKeranjangByPembeliId(pembeliID);
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Cart successfully found",
      data: keranjang,
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

const addKeranjang = async (req, res, next) => {
  try {
    const { pembeliID, produk } = req.body;

    if (!pembeliID || !produk) {
      return res.status(400).json({
        status: "error",
        message: "pembeliID dan produk harus disertakan dalam request",
      });
    }

    const newKeranjang = await keranjangService.addKeranjangProduk(
      pembeliID,
      produk
    );

    res.status(201).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Cart successfully added",
      data: newKeranjang,
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

const updateKeranjang = async (req, res, next) => {
  try {
    const { keranjangID } = req.params;
    const { produkID, jumlah } = req.body;
    const updatedKeranjang = await keranjangService.updateKeranjangProduk(
      keranjangID,
      produkID,
      jumlah
    );
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Cart successfully updated",
      data: updatedKeranjang,
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

const deleteKeranjang = async (req, res, next) => {
  try {
    const { keranjangID } = req.params;
    await keranjangService.deleteKeranjang(keranjangID);
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Cart successfully deleted",
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
  getAllKeranjang,
  getKeranjangByPembeliId,
  addKeranjang,
  updateKeranjang,
  deleteKeranjang,
};
