const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const keranjang = {
  findAll: async () => {
    return await prisma.keranjang.findMany({
      include: {
        Pembeli: true,
        Produk: true,
      },
    });
  },
  create: async (data) => {
    return await prisma.keranjang.create({data});
  },
};

module.exports = keranjang;
