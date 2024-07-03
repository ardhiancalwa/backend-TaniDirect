const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllPembeli = async () => {
  return await prisma.pembeli.findMany();
};

const getPembeliById = async (id) => {
  return await prisma.pembeli.findUnique({ where: { pembeliID: id } });
};

const getPembeliByEmail = async (email) => {
  return await prisma.pembeli.findUnique({ where: { email_pembeli: email } });
};

const createPembeli = async (data) => {
  return await prisma.pembeli.create({ data });
};

const updatePembeli = async (id, data) => {
  return await prisma.pembeli.update({ where: { pembeliID: id }, data });
}

const deletePembeli = async (id) => {
  return await prisma.pembeli.delete({ where: { pembeliID: id } });
}

module.exports = {
  getAllPembeli,
  getPembeliById,
  getPembeliByEmail,
  createPembeli,
  updatePembeli,
  deletePembeli,
};