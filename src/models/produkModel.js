const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const Produk = {
  findAll: async (sortField, sortOrder) => {
    return await prisma.produk.findMany({
      orderBy: { [sortField]: sortOrder },
      include: {
        PetaniProduk : {
          include: {
            Petani: true,
          }
        }
      }
    });
  },
  findById: async (produkID) => {
    return await prisma.produk.findUnique({
      where: { produkID: parseInt(produkID) },
      include: {
        PetaniProduk: {
          include: {
            Petani: true,
          },  
        }
      }
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
        nama_produk: data.nama_produk, 
        deskripsi_produk: data.deskripsi_produk,
        image_produk: data.image_produk, 
        harga: data.harga, 
        jumlah_stok: data.jumlah_stok,
        jumlah_produk: data.jumlah_produk ?? 1,
        berat_produk: data.berat_produk ?? 20, 
        PetaniProduk: {
          create: {
            petaniID: parseInt(data.petaniID, 10), 
          },
        },
      },
      include: {
        PetaniProduk: true, 
      },
    });
  },
  update: async (id, data) => {
    return await prisma.produk.update({
      where: { produkID: parseInt(id) },
      data: {
        nama_produk: data.nama_produk,
        deskripsi_produk: data.deskripsi_produk,
        image_produk: data.image_produk,
        harga: data.harga,
        jumlah_stok: data.jumlah_stok,
        jumlah_produk: data.jumlah_produk,
        berat_produk: data.berat_produk,
      },
      include: {
        PetaniProduk: true,
      },
    });
  },
  delete: async (produkID) => {
    return await prisma.produk.delete({
      where: { produkID: parseInt(produkID) },
    });
  },
};

module.exports = Produk;
