const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const Promo = {
  findAll: async () => {
    return await prisma.promo.findMany();
  },
  findByName: async (nama_promo) => {
    return await prisma.promo.findUnique({
      where: { nama_promo },
    });
  },
  create: async (data) => {
    return await prisma.promo.create({
      data,
    });
  },
  update: async (nama_promo, data) => {
    return await prisma.promo.update({
      where: { nama_promo },
      data,
    });
  },
  delete: async (nama_promo) => {
    return await prisma.promo.delete({
      where: { nama_promo },
    });
  },
};

module.exports = Promo;
