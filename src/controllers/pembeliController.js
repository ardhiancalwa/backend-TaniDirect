const PembeliService = require("../services/pembeliService");

const getAllPembeli = async (req, res, next) => {
  try {
    const pembeli = await PembeliService.getAllPembeli();
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "User successfully found",
      data: pembeli,
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

const getPembeliById = async (req, res, next) => {
  const { pembeliID } = req.params;

  try {
    const pembeli = await PembeliService.getPembeliById(pembeliID);
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "User successfully found",
      data: pembeli,
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

const updatePembeli = async (req, res, next) => {
  const { pembeliID } = req.params;

  try {
    const updatePembeli = await PembeliService.updatePembeli(
      pembeliID,
      req.body,
      req.file,
    );
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Successfully updated",
      data: updatePembeli,
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

const deletePembeli = async (req, res, next) => {
  const { pembeliID } = req.params;

  try {
    await PembeliService.deletePembeli(parseInt(pembeliID));
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "User successfully deleted",
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

const registerPembeli = async (req, res, next) => {
  try {
    const { token, newPembeli } = await PembeliService.registerPembeli(
      req.body
    );
    res.status(201).json({
      status: "success",
      message: "User successfully registered",
      data: { token, newPembeli },
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

const loginPembeli = async (req, res, next) => {
  try {
    const { token, id } = await PembeliService.loginPembeli(req.body);
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Login successful",
      data: { token, pembeliID: id },
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
  getAllPembeli,
  getPembeliById,
  updatePembeli,
  deletePembeli,
  registerPembeli,
  loginPembeli,
};
