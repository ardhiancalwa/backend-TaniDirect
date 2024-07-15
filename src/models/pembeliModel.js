const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const Pembeli = {
  findAll: async () => {
    return await prisma.pembeli.findMany();
  },
  findById: async (pembeliID) => {
    return await prisma.pembeli.findUnique({
      where: { pembeliID: parseInt(pembeliID) },
    });
  },
  findByEmail: async (email_pembeli) => {
    return await prisma.pembeli.findUnique({
      where: { email_pembeli },
    });
  },
  create: async (data) => {
    return await prisma.pembeli.create({ data });
  },
  update: async (pembeliID, data) => {
    return await prisma.pembeli.update({
      where: { pembeliID: parseInt(pembeliID) },
      data,
    });
  },
  delete: async (pembeliID) => {
    return await prisma.pembeli.delete({
      where: { pembeliID: parseInt(pembeliID) },
    });
  },
};

module.exports = Pembeli;
