const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const Kategori = {
  findAll: async () => {
    return await prisma.kategori.findMany();
  },
  findById: async (kategoriID) => {
    return await prisma.kategori.findUnique({
      where: { kategoriID: parseInt(kategoriID) },
    });
  },
  create: async (data) => {
    return await prisma.kategori.create({
      data,
    });
  },
  update: async (kategoriID, data) => {
    return await prisma.kategori.update({
      where: { kategoriID: parseInt(kategoriID) },
      data,
    });
  },
  delete: async (kategoriID) => {
    return await prisma.kategori.delete({
      where: { kategoriID: parseInt(kategoriID) },
    });
  },
};

module.exports = Kategori;
