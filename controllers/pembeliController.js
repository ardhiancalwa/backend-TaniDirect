const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const pembeliSchema = Joi.object({
  nama_pembeli: Joi.string().required(),
  alamat_pembeli: Joi.string().required(),
  kontak_pembeli: Joi.string().required(),
  email_pembeli: Joi.string().email().required(),
  password_pembeli: Joi.string().required(),
  image_pembeli: Joi.string().optional(),
});

const loginSchema = Joi.object({
  email_pembeli: Joi.string().email().required(),
  password_pembeli: Joi.string().required(),
});

// Generate token for pembeli
const generatePembeliToken = (pembeli) => {
  return jwt.sign({ id: pembeli.pembeliID }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const getAllPembeli = async (req, res, next) => {
  try {
    const pembeli = await prisma.pembeli.findMany();
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
    const pembeli = await prisma.pembeli.findUnique({
      where: { pembeliID: parseInt(pembeliID) },
    });
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
  const { error } = pembeliSchema.validate(req.body);
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
    const hashedPassword = await bcrypt.hash(password_pembeli, 10);
    const data = await prisma.pembeli.update({
      where: { pembeliID: parseInt(pembeliID) },
      data: {
        nama_pembeli,
        alamat_pembeli,
        kontak_pembeli,
        email_pembeli,
        password_pembeli: hashedPassword,
        image_pembeli: req.file ? req.file.filename : image_pembeli,
      },
    });
    res.status(200).json({
      status: "success",
      message: "Pembeli berhasil diupdate",
      data,
    });
  } catch (error) {
    if (error.code === "P2025") {
      // Handle record not found error
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
    await prisma.pembeli.delete({
      where: { pembeliID: parseInt(pembeliID) },
    });
    res.status(200).json({
      status: "success",
      message: "Pembeli berhasil dihapus",
    });
  } catch (error) {
    if (error.code === "P2025") {
      // Handle record not found error
      return res
        .status(404)
        .json({ status: "error", message: "Pembeli tidak ditemukan" });
    }
    next(error);
  }
};

const registerPembeli = async (req, res, next) => {
  const { error } = pembeliSchema.validate(req.body);
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
    const hashedPassword = await bcrypt.hash(password_pembeli, 10);
    const newPembeli = await prisma.pembeli.create({
      data: {
        nama_pembeli,
        alamat_pembeli,
        kontak_pembeli,
        email_pembeli,
        password_pembeli: hashedPassword,
        image_pembeli: req.file ? req.file.filename : image_pembeli,
      },
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
  const { error } = loginSchema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: "error", message: error.details[0].message });

  const { email_pembeli, password_pembeli } = req.body;

  try {
    const pembeli = await prisma.pembeli.findUnique({
      where: { email_pembeli },
    });
    if (!pembeli)
      return res
        .status(404)
        .json({ status: "error", message: "Email atau password salah" });

    const validPassword = await bcrypt.compare(
      password_pembeli,
      pembeli.password_pembeli
    );
    if (!validPassword)
      return res
        .status(404)
        .json({ status: "error", message: "Email atau password salah" });

    const token = generatePembeliToken(pembeli);
    res.status(200).json({
      status: "success",
      message: "Login berhasil",
      data: {
        token,
      },
    });
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
