const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllPetani = async () => {
  return await prisma.petani.findMany();
};

const getPetaniById = async (id) => {
  return await prisma.petani.findUnique({ where: { petaniID: id } });
};

const getPetaniByEmail = async (email) => {
  return await prisma.petani.findUnique({ where: { email_petani: email } });
};

const createPetani = async (data) => {
  return await prisma.petani.create({ data });
};

const updatePetani = async (id, data) => {
  return await prisma.petani.update({ where: { petaniID: id }, data });
};

const deletePetani = async (id) => {
  return await prisma.petani.delete({ where: { petaniID: id } });
};

module.exports = {
  getAllPetani,
  getPetaniById,
  getPetaniByEmail,
  createPetani,
  updatePetani,
  deletePetani,
};
