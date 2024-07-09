const PembeliService = require("../services/pembeliService");

const getAllPembeli = async (req, res, next) => {
  try {
    const pembeli = await PembeliService.findAllPembeli();
    if (pembeli.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Data tidak ditemukan" });
    }
    res.status(200).json({
      status: "success",
      message: "Data pembeli berhasil ditemukan",
      data: pembeli,
    });
  } catch (error) {
    next(error);
  }
};

const getPembeliById = async (req, res, next) => {
  const { pembeliID } = req.params;

  try {
    const pembeli = await PembeliService.findPembeliById(parseInt(pembeliID));
    if (!pembeli) {
      return res
        .status(404)
        .json({ status: "error", message: "Pembeli tidak ditemukan" });
    }
    res.status(200).json({
      status: "success",
      message: "Data pembeli berhasil ditemukan",
      data: pembeli,
    });
  } catch (error) {
    next(error);
  }
};

const updatePembeli = async (req, res, next) => {
  const { pembeliID } = req.params;
  const { error } = PembeliService.validatePembeli(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: "error", message: error.details[0].message });

  const {
    nama_pembeli,
    alamat_pembeli,
    kontak_pembeli,
    email_pembeli,
    password_pembeli,
    image_pembeli,
  } = req.body;

  try {
    const hashedPassword = await PembeliService.hashPassword(password_pembeli);
    const data = await PembeliService.updatePembeli(parseInt(pembeliID), {
      nama_pembeli,
      alamat_pembeli,
      kontak_pembeli,
      email_pembeli,
      password_pembeli: hashedPassword,
      image_pembeli: req.file ? req.file.filename : image_pembeli,
    });
    res
      .status(200)
      .json({ status: "success", message: "Pembeli berhasil diupdate", data });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ status: "error", message: "Pembeli tidak ditemukan" });
    }
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
  const { error } = PembeliService.validatePembeli(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: "error", message: error.details[0].message });

  const {
    nama_pembeli,
    alamat_pembeli,
    kontak_pembeli,
    email_pembeli,
    password_pembeli,
    image_pembeli,
  } = req.body;

  try {
    const hashedPassword = await PembeliService.hashPassword(password_pembeli);
    const newPembeli = await PembeliService.createPembeli({
      nama_pembeli,
      alamat_pembeli,
      kontak_pembeli,
      email_pembeli,
      password_pembeli: hashedPassword,
      image_pembeli: req.file ? req.file.filename : image_pembeli,
    });
    res.status(201).json({
      status: "success",
      message: "Pembeli berhasil didaftarkan",
      data: newPembeli,
    });
  } catch (error) {
    next(error);
  }
};

const loginPembeli = async (req, res, next) => {
  const { error } = PembeliService.validateLogin(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: "error", message: error.details[0].message });

  const { email_pembeli, password_pembeli } = req.body;

  try {
    const pembeli = await PembeliService.findPembeliByEmail(email_pembeli);
    if (!pembeli)
      return res
        .status(404)
        .json({ status: "error", message: "Email atau password salah" });

    const validPassword = await PembeliService.comparePassword(
      password_pembeli,
      pembeli.password_pembeli
    );
    if (!validPassword)
      return res
        .status(404)
        .json({ status: "error", message: "Email atau password salah" });

    const token = PembeliService.generateToken(pembeli);
    res
      .status(200)
      .json({ status: "success", message: "Login berhasil", data: { token } });
  } catch (error) {
    next(error);
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
