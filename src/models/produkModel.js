const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const Produk = {
  findAll: async (sortField, sortOrder) => {
    return await prisma.produk.findMany({
      orderBy: { [sortField]: sortOrder },
    });
  },
  findById: async (produkID) => {
    return await prisma.produk.findUnique({
      where: { produkID: parseInt(produkID) },
    });
  },
  findByName: async (nama_produk) => {
    return await prisma.produk.findMany({
      where: { nama_produk: { contains: nama_produk } },
    });
  },
  create: async (data) => {
    return await prisma.produk.create({
      data : data,
    });
  },
  update: async (id, data) => {
    return await prisma.produk.update({
      where: { produkID: parseInt(id) },
      data : data,
    });
  },
  delete: async (produkID) => {
    return await prisma.produk.delete({
      where: { produkID: parseInt(produkID) },
    });
  },
};

module.exports = Produk;
