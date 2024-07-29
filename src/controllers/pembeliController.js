const PembeliService = require("../services/pembeliService");

const getAllPembeli = async (req, res, next) => {
  try {
    const pembeli = await PembeliService.getAllPembeli();
    res.status(200).json({
      status: "success",
      message: "Data pembeli berhasil ditemukan",
      data: pembeli,
    });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
};

const getPembeliById = async (req, res, next) => {
  const { pembeliID } = req.params;

  try {
    const pembeli = await PembeliService.getPembeliById(pembeliID);
    res.status(200).json({
      status: "success",
      message: "Data pembeli berhasil ditemukan",
      data: pembeli,
    });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
};

const updatePembeli = async (req, res, next) => {
  console.log('Request Body:', req.body);
  const { pembeliID } = req.params;

  try {
    const updatePembeli = await PembeliService.updatePembeli(
      pembeliID,
      req.body
    );
    res.status(200).json({
      status: "success",
      message: "Pembeli berhasil diupdate",
      data: updatePembeli,
    });
    console.log('Response:', res);
  } catch (error) {
    // res.status(400).json({ status: "error", message: error.message });
    next(error);
  }
};

const deletePembeli = async (req, res, next) => {
  const { pembeliID } = req.params;

  try {
    await PembeliService.deletePembeli(parseInt(pembeliID));
    res
      .status(200)
      .json({ status: "success", message: "Pembeli berhasil dihapus" });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ status: "error", message: "Pembeli tidak ditemukan" });
    }
    next(error);
  }
};

const registerPembeli = async (req, res, next) => {
  try {
    const newPembeli = await PembeliService.registerPembeli(req.body);
    res.status(201).json({
      status: "success",
      message: "Pembeli berhasil didaftarkan",
      data: newPembeli,
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

const loginPembeli = async (req, res, next) => {
  try {
    const { token, id } = await PembeliService.loginPembeli(req.body);
    res.status(200).json({
      status: "success",
      message: "Login berhasil",
      data: { token, pembeliID: id },
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
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
