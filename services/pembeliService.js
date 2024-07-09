const PembeliModel = require("../models/pembeliModel");
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

const generatePembeliToken = (pembeli) => {
  return jwt.sign({ id: pembeli.pembeliID }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const PembeliService = {
  validatePembeli: (data) => pembeliSchema.validate(data),
  validateLogin: (data) => loginSchema.validate(data),
  hashPassword: (password) => bcrypt.hash(password, 10),
  comparePassword: (inputPassword, storedPassword) =>
    bcrypt.compare(inputPassword, storedPassword),
  generateToken: generatePembeliToken,
  findAllPembeli: () => PembeliModel.findAll(),
  findPembeliById: (pembeliID) => PembeliModel.findById(pembeliID),
  findPembeliByEmail: (email_pembeli) =>
    PembeliModel.findByEmail(email_pembeli),
  createPembeli: (data) => PembeliModel.create(data),
  updatePembeli: (pembeliID, data) => PembeliModel.update(pembeliID, data),
  deletePembeli: (pembeliID) => PembeliModel.delete(pembeliID),
};

module.exports = PembeliService;
