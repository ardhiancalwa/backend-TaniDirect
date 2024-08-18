const produkService = require("../services/produkService");

const getAllProduk = async (req, res, next) => {
  try {
    const { sort, order } = req.query;
    const produk = await produkService.getAllProduk(sort, order);
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Product successfully found",
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

const addProduk = async (req, res, next) => {
  try {
    let imageFileNames = [];

    // Pastikan file diunggah sebelum mengambil nama file
    if (req.files && req.files.length > 0) {
      imageFileNames = req.files.map(file => `/produk/${file.filename}`);
    }

    // Set image_produk sebagai array
    req.body.image_produk = imageFileNames;
    const newProduk = await produkService.addProduk(req.body);
    res.status(201).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Product successfully added",
      data: newProduk,
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

const searchProduk = async (req, res, next) => {
  try {
    const { nama_produk } = req.query;
    const produk = await produkService.searchProduk(nama_produk);
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "List of products found",
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

const getProdukById = async (req, res, next) => {
  try {
    const { produkID } = req.params;
    const produk = await produkService.getProdukById(produkID);
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Product data successfully found",
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

const getProdukByPetaniId = async (req, res, next) => {
  try {
    const { petaniID } = req.params;
    const produk = await produkService.getProdukByPetaniId(petaniID);
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Product data successfully found",
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

const updateProduk = async (req, res, next) => {
  try {
    const { produkID } = req.params;
    let imageFileNames = [];

    // Pastikan file diunggah sebelum mengambil nama file
    if (req.files && req.files.length > 0) {
      imageFileNames = req.files.map(file => `/produk/${file.filename}`);
    }

    // Set image_produk sebagai array
    req.body.image_produk = imageFileNames;
    const updatedProduk = await produkService.updateProduk(produkID, req.body);
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Product successfully updated",
      data: updatedProduk,
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

const deleteProduk = async (req, res, next) => {
  const { produkID } = req.params;
  try {
    await produkService.deleteProduk(produkID);
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Product successfully deleted",
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
  getAllProduk,
  addProduk,
  searchProduk,
  getProdukById,
  getProdukByPetaniId,
  updateProduk,
  deleteProduk,
};
