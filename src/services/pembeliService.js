const Pembeli = require("../models/pembeliModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const {
  ValidationError,
  AuthenticationError,
  NotFoundError,
} = require("../middlewares/errorHandler");

const pembeliSchema = Joi.object({
  nama_pembeli: Joi.string().required(),
  provinsi: Joi.string().optional(),
  kota: Joi.string().optional(),
  kecamatan: Joi.string().optional(),
  kode_pos: Joi.string().optional(),
  detail_alamat: Joi.string().optional(),
  nama_alamat: Joi.string().optional(),
  kontak_pembeli: Joi.string().required(),
  email_pembeli: Joi.string().email().required(),
  password_pembeli: Joi.string().required(),
  image_pembeli: Joi.string().optional(),
  tanggal_lahir: Joi.date().optional(),
});

const updatePembeliSchema = Joi.object({
  nama_pembeli: Joi.string().optional(),
  provinsi: Joi.string().optional(),
  kota: Joi.string().optional(),
  kecamatan: Joi.string().optional(),
  kode_pos: Joi.string().optional(),
  detail_alamat: Joi.string().optional(),
  nama_alamat: Joi.string().optional(),
  kontak_pembeli: Joi.string().optional(),
  email_pembeli: Joi.string().email().optional(),
  password_pembeli: Joi.string().optional(),
  image_pembeli: Joi.string().optional(),
  tanggal_lahir: Joi.date().optional(),
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
    throw new NotFoundError("Data not found");
  }
  return pembeli;
};

const getPembeliById = async (pembeliID) => {
  const pembeli = await Pembeli.findById(pembeliID);
  if (!pembeli) {
    throw new NotFoundError("User not found");
  }
  return pembeli;
};

const registerPembeli = async (pembeliData) => {
  pembeliData.image_pembeli =
    pembeliData.image_pembeli || "toufnsfyaeee0suofqji.png";
  pembeliData.tanggal_lahir = pembeliData.tanggal_lahir || new Date();
  pembeliData.provinsi = pembeliData.provinsi || "provinsi";
  pembeliData.kota = pembeliData.kota || "kota";
  pembeliData.kecamatan = pembeliData.kecamatan || "kecamatan";
  pembeliData.kode_pos = pembeliData.kode_pos || "kode pos";
  pembeliData.detail_alamat = pembeliData.detail_alamat || "detail alamat";
  pembeliData.nama_alamat = pembeliData.nama_alamat || "nama alamat";

  const { error } = pembeliSchema.validate(pembeliData);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const { email_pembeli, password_pembeli } = pembeliData;
  const existingPembeli = await Pembeli.findByEmail(email_pembeli);
  if (existingPembeli) {
    throw new ValidationError("Email already in use");
  }

  const newPembeli = await Pembeli.create({
    ...pembeliData,
    password_pembeli: await bcrypt.hash(pembeliData.password_pembeli, 10),
  });
  const token = generatePembeliToken(newPembeli);
  return { token, newPembeli };
};

const loginPembeli = async (loginData) => {
  const { error } = loginSchema.validate(loginData);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const { email_pembeli, password_pembeli } = loginData;
  const pembeli = await Pembeli.findByEmail(email_pembeli);
  if (!pembeli) {
    throw new AuthenticationError("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    password_pembeli,
    pembeli.password_pembeli
  );
  if (!isPasswordValid) {
    throw new AuthenticationError("Invalid email or password");
  }

  const token = generatePembeliToken(pembeli);
  return { token, id: pembeli.pembeliID };
};

const updatePembeli = async (pembeliID, updateData, file) => {
  const { error } = updatePembeliSchema.validate(updateData);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const pembeli = await Pembeli.findById(pembeliID);
  if (!pembeli) {
    throw new NotFoundError("User not found");
  }

  const formattedDate = updateData.tanggal_lahir
    ? new Date(updateData.tanggal_lahir)
    : undefined;

  // const imageUrl = updateData.image_pembeli;
  // const imageFileName = imageUrl.split("/").pop();

  const dataToUpdate = {
    ...updateData,
    tanggal_lahir: formattedDate,
    // image_pembeli: `user/${imageFileName}`,
    // password_pembeli: updateData.password_pembeli
    //   ? await bcrypt.hash(updateData.password_pembeli, 10)
    //   : undefined,
  };

  // Object.keys(dataToUpdate).forEach((key) => {
  //   if (dataToUpdate[key] === undefined) {
  //     delete dataToUpdate[key];
  //   }
  // });

  const updatedPembeli = await Pembeli.update(pembeliID, dataToUpdate, file);
  return updatedPembeli;
};

const deletePembeli = async (pembeliID) => {
  const pembeli = await Pembeli.findById(pembeliID);
  if (!pembeli) {
    throw new NotFoundError("User not found");
  }
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
