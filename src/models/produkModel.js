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
  findByPetaniId: async (petaniID) => {
    return await prisma.produk.findMany({
      where: {
        PetaniProduk: {
          some: {
            petaniID: parseInt(petaniID),
          },
        },
      },
    });
  },
  findByName: async (nama_produk) => {
    return await prisma.$queryRaw`SELECT * FROM "Produk" WHERE LOWER(nama_produk) LIKE LOWER(${`%${nama_produk}%`})`;
  },
  create: async (data) => {
    return await prisma.produk.create({
      data: {
        nama_produk: data.nama_produk, // Include nama_produk
        deskripsi_produk: data.deskripsi_produk, // Include deskripsi_produk
        image_produk: data.image_produk, // Include image_produk
        harga: data.harga, // Include harga
        jumlah_stok: data.jumlah_stok, // Include jumlah_stok
        PetaniProduk: {
          create: {
            petaniID: parseInt(data.petaniID, 10), // Establish relation with Petani using PetaniProduk
          },
        },
      },
      include: {
        PetaniProduk: true, // Include PetaniProduk in the response
      },
    });
  },
  update: async (id, data) => {
    return await prisma.produk.update({
      where: { produkID: parseInt(id) },
      data: data,
    });
  },
  delete: async (produkID) => {
    return await prisma.produk.delete({
      where: { produkID: parseInt(produkID) },
    });
  },
};

module.exports = Produk;
