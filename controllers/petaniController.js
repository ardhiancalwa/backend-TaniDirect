const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const petaniSchema = Joi.object({
  nama_petani: Joi.string().required(),
  alamat_petani: Joi.string().required(),
  no_telepon_petani: Joi.string().required(),
  email_petani: Joi.string().email().required(),
  password_petani: Joi.string().required(),
  image_petani: Joi.string().optional()
});

const loginSchema = Joi.object({
  email_petani: Joi.string().email().required(),
  password_petani: Joi.string().required()
});

const getAllPetani = async (req, res, next) => {
  try {
    const petani = await prisma.petani.findMany();
    if (petani.length === 0) {
      const error = new Error('Data tidak ditemukan');
      res.status(404);
      throw error;
    }
    res.json(petani);
  } catch (error) {
    next(error);
  }
};

const createPetani = async (req, res, next) => {
  const { error } = petaniSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { nama_petani, alamat_petani, no_telepon_petani, email_petani, password_petani, image_petani } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password_petani, 10);
    const newPetani = await prisma.petani.create({
      data: {
        nama_petani,
        alamat_petani,
        no_telepon_petani,
        email_petani,
        password_petani: hashedPassword,
        image_petani
      }
    });
    res.status(201).json(newPetani);
  } catch (error) {
    next(error);
  }
};

const getPetaniById = async (req, res, next) => {
  const { petaniID } = req.params;

  try {
    const petani = await prisma.petani.findUnique({ where: { petaniID: parseInt(petaniID) } });
    if (!petani) {
      const error = new Error('Petani tidak ditemukan');
      res.status(404);
      throw error;
    }
    res.json(petani);
  } catch (error) {
    next(error);
  }
};

const updatePetani = async (req, res, next) => {
  const { petaniID } = req.params;
  const { error } = petaniSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { nama_petani, alamat_petani, no_telepon_petani, email_petani, password_petani, image_petani } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password_petani, 10);
    const updatedPetani = await prisma.petani.update({
      where: { petaniID: parseInt(petaniID) },
      data: {
        nama_petani,
        alamat_petani,
        no_telepon_petani,
        email_petani,
        password_petani: hashedPassword,
        image_petani
      }
    });
    res.json(updatedPetani);
  } catch (error) {
    next(error);
  }
};

const deletePetani = async (req, res, next) => {
  const { petaniID } = req.params;

  try {
    await prisma.petani.delete({ where: { petaniID: parseInt(petaniID) } });
    res.json({ message: 'Petani berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};

const registerPetani = async (req, res, next) => {
  const { error } = petaniSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { nama_petani, alamat_petani, no_telepon_petani, email_petani, password_petani, image_petani } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password_petani, 10);
    const newPetani = await prisma.petani.create({
      data: {
        nama_petani,
        alamat_petani,
        no_telepon_petani,
        email_petani,
        password_petani: hashedPassword,
        image_petani
      }
    });
    res.status(201).json(newPetani);
  } catch (error) {
    next(error);
  }
};

const loginPetani = async (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email_petani, password_petani } = req.body;

  try {
    const petani = await prisma.petani.findUnique({ where: { email_petani } });
    if (!petani) return res.status(404).json({ message: 'Email atau password salah' });

    const validPassword = await bcrypt.compare(password_petani, petani.password_petani);
    if (!validPassword) return res.status(404).json({ message: 'Email atau password salah' });

    const token = jwt.sign({ id: petani.petaniID }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPetani,
  createPetani,
  getPetaniById,
  updatePetani,
  deletePetani,
  registerPetani,
  loginPetani
};
