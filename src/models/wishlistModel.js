const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const Wishlist = {
  findByPembeliID: async (pembeliID) => {
    return await prisma.wishlistProduk.findMany({
      where: {
        pembeliID: parseInt(pembeliID),
      },
      include: {
        Produk: true,
      },
    });
  },
  findWishlistID: async (wishlistID) => {
    return await prisma.wishlistProduk.findUnique({
      where: {
        wishlistID: parseInt(wishlistID),
      },
      include: {
        Produk: true,
      },
    });
  },
  addProduk: async ({ pembeliID, produkID }) => {
    return await prisma.wishlistProduk.create({
      data: {
        pembeliID: parseInt(pembeliID),
        produkID: parseInt(produkID),
      },
    });
  },
  removeProduk: async (wishlistID) => {
    return await prisma.wishlistProduk.delete({
      where: {
        wishlistID: parseInt(wishlistID),
      },
    });
  },
};

module.exports = Wishlist;
