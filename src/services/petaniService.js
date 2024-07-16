const Petani = require("../models/petaniModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

// validations data petani
const petaniSchema = Joi.object({
  nama_petani: Joi.string().required(),
  alamat_petani: Joi.string().required(),
  no_telepon_petani: Joi.string().required(),
  email_petani: Joi.string().email().required(),
  password_petani: Joi.string().required(),
  image_petani: Joi.string().optional(),
});

const updatePetaniSchema = Joi.object({
  nama_petani: Joi.string().optional(),
  alamat_petani: Joi.string().optional(),
  no_telepon_petani: Joi.string().optional(),
  email_petani: Joi.string().email().optional(),
  password_petani: Joi.string().optional(),
  image_petani: Joi.string().optional(),
})

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
    throw new Error("Data tidak ditemukan");
  }
  return petani;
};

const getPetaniById = async (petaniID) => {
  const petani = await Petani.findById(petaniID);
  if (!petani) {
    throw new Error("Petani tidak ditemukan");
  }
  return petani;
};

const registerPetani = async (petaniData) => {
  const { error } = petaniSchema.validate(petaniData);
  if (error) {
    throw new Error(error.details[0].message);
  }

  const newPetani = await Petani.create({
    ...petaniData,
    password_petani: await bcrypt.hash(petaniData.password_petani, 10),
  });

  return newPetani;
};

const loginPetani = async (loginData) => {
  const { error } = loginSchema.validate(loginData);
  if (error) {
    throw new Error(error.details[0].message);
  }

  const { email_petani, password_petani } = loginData;
  const petani = await Petani.findByEmail(email_petani);
  if (
    !petani ||
    !(await bcrypt.compare(password_petani, petani.password_petani))
  ) {
    throw new Error("Email atau password salah");
  }

  const token = generatePetaniToken(petani);
  return token;
};

const updatePetani = async (petaniID, updateData) => {
  const { error } = updatePetaniSchema.validate(updateData);
  if (error) {
    throw new Error(error.details[0].message);
  }

  const updatedPetani = await Petani.update(petaniID, {
    ...updateData,
    password_petani: updateData.password_petani
      ? await bcrypt.hash(updateData.password_petani, 10)
      : undefined,
  });

  return updatedPetani;
};

const deletePetani = async (petaniID) => {
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
