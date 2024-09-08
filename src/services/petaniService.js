const Petani = require("../models/petaniModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const {
  ValidationError,
  AuthenticationError,
  NotFoundError,
} = require("../middlewares/errorHandler");

// validations data petani
const petaniSchema = Joi.object({
  nama_petani: Joi.string().required(),
  provinsi: Joi.string().allow("").optional(),
  kota: Joi.string().allow("").optional(),
  kecamatan: Joi.string().allow("").optional(),
  kode_pos: Joi.string().allow("").optional(),
  detail_alamat: Joi.string().allow("").optional(),
  nama_alamat: Joi.string().allow("").optional(),
  no_telepon_petani: Joi.string().required(),
  email_petani: Joi.string().email().required(),
  password_petani: Joi.string().required(),
  image_petani: Joi.string().optional(),
  tanggal_lahir: Joi.date().optional(),
  deskripsi: Joi.string().allow("").optional(),
});

const updatePetaniSchema = Joi.object({
  nama_petani: Joi.string().optional(),
  provinsi: Joi.string().optional(),
  kota: Joi.string().optional(),
  kecamatan: Joi.string().optional(),
  kode_pos: Joi.string().optional(),
  detail_alamat: Joi.string().optional(),
  nama_alamat: Joi.string().optional(),
  no_telepon_petani: Joi.string().optional(),
  email_petani: Joi.string().email().optional(),
  password_petani: Joi.string().optional(),
  image_petani: Joi.string().optional(),
  tanggal_lahir: Joi.date().optional(),
  deskripsi: Joi.string().optional(),
});

// validations data login petani
const loginSchema = Joi.object({
  email_petani: Joi.string().email().required(),
  password_petani: Joi.string().required(),
});

// generate token petani
const generatePetaniToken = (petani) => {
  return jwt.sign({ id: petani.petaniID }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const getAllPetani = async () => {
  const petani = await Petani.findAll();
  if (petani.length === 0) {
    throw new NotFoundError("Data not found");
  }
  return petani;
};

const getPetaniById = async (petaniID) => {
  const petani = await Petani.findById(petaniID);
  if (!petani) {
    throw new NotFoundError("User not found");
  }
  return petani;
};

const registerPetani = async (petaniData) => {
  petaniData.image_petani =
    petaniData.image_petani || "toufnsfyaeee0suofqji.png";
  petaniData.tanggal_lahir = petaniData.tanggal_lahir || new Date();
  petaniData.deskripsi = petaniData.deskripsi || "";
  petaniData.provinsi = petaniData.provinsi || "";
  petaniData.kota = petaniData.kota || "";
  petaniData.kecamatan = petaniData.kecamatan || "";
  petaniData.kode_pos = petaniData.kode_pos || "";
  petaniData.detail_alamat = petaniData.detail_alamat || "";
  petaniData.nama_alamat = petaniData.nama_alamat || "";

  const { error } = petaniSchema.validate(petaniData);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const { email_petani, password_petani } = petaniData;
  const existingPetani = await Petani.findByEmail(email_petani);
  if (existingPetani) {
    throw new ValidationError("Email already in use");
  }

  const newPetani = await Petani.create({
    ...petaniData,
    password_petani: await bcrypt.hash(petaniData.password_petani, 10),
  });
  const token = generatePetaniToken(newPetani);
  return { token, newPetani };
};

const loginPetani = async (loginData) => {
  const { error } = loginSchema.validate(loginData);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const { email_petani, password_petani } = loginData;
  const petani = await Petani.findByEmail(email_petani);
  if (!petani) {
    throw new AuthenticationError("Invalid email or password");
  }

  if (!(await bcrypt.compare(password_petani, petani.password_petani))) {
    console.log(error);
  }

  const token = generatePetaniToken(petani);
  return { token, id: petani.petaniID };
};

const updatePetani = async (petaniID, updateData, file) => {
  const { error } = updatePetaniSchema.validate(updateData);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const petani = await Petani.findById(petaniID);
  if (!petani) {
    throw new NotFoundError("User not found");
  }

  const updatedPetani = await Petani.update(petaniID, updateData, file);

  return updatedPetani;
};

const deletePetani = async (petaniID) => {
  const petani = await Petani.findById(petaniID);
  if (!petani) {
    throw new NotFoundError("User not found");
  }
  await Petani.delete(petaniID);
};

module.exports = {
  getAllPetani,
  getPetaniById,
  registerPetani,
  loginPetani,
  updatePetani,
  deletePetani,
};
