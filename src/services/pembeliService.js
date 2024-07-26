const Pembeli = require("../models/pembeliModel");
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
  tanggal_lahir: Joi.date().optional()
});

const updatePembeliSchema = Joi.object({
  nama_pembeli: Joi.string().optional(),
  alamat_pembeli: Joi.string().optional(),
  kontak_pembeli: Joi.string().optional(),
  email_pembeli: Joi.string().email().optional(),
  password_pembeli: Joi.string().optional(),
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

const getAllPembeli = async () => {
  const pembeli = await Pembeli.findAll();
  if (pembeli.length === 0) {
    throw new Error("Data tidak ditemukan");
  }
  return pembeli;
};

const getPembeliById = async (pembeliID) => {
  const pembeli = await Pembeli.findById(pembeliID);
  if (!pembeli) {
    throw new Error("Pembeli tidak ditemukan");
  }
  return pembeli;
};

const registerPembeli = async (pembeliData) => {
  pembeliData.image_pembeli = pembeliData.image_pembeli || "default_pfp.png";
  pembeliData.tanggal_lahir = pembeliData.tanggal_lahir || new Date();

  const { error } = pembeliSchema.validate(pembeliData);
  if (error) {
    throw new Error(error.details[0].message);
  }

  const newPembeli = await Pembeli.create({
    ...pembeliData,
    password_pembeli: await bcrypt.hash(pembeliData.password_pembeli, 10),
  });

  return newPembeli;
};

const loginPembeli = async (loginData) => {
  const { error } = loginSchema.validate(loginData);
  if (error) {
    throw new Error(error.details[0].message);
  }

  const { email_pembeli, password_pembeli } = loginData;
  const pembeli = await Pembeli.findByEmail(email_pembeli);
  if (
    !pembeli ||
    !(await bcrypt.compare(password_pembeli, pembeli.password_pembeli))
  ) {
    throw new Error("Email atau password salah");
  }

  const token = generatePembeliToken(pembeli);
  return { token, id: pembeli.pembeliID };
};

const updatePembeli = async (pembeliID, updateData) => {
  const { error } = updatePembeliSchema.validate(updateData);
  if (error) {
    throw new Error(error.details[0].message);
  }

  const updatePembeli = await Pembeli.update(pembeliID, {
    ...updateData,
    password_pembeli: updateData.password_pembeli
      ? await bcrypt.hash(updateData.password_pembeli, 10)
      : undefined,
  });
  return updatePembeli;
};

const deletePembeli = async (pembeliID) => {
  await Pembeli.delete(pembeliID);
};

module.exports = {
  getAllPembeli,
  getPembeliById,
  registerPembeli,
  loginPembeli,
  updatePembeli,
  deletePembeli,
};
