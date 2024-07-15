const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const Transaksi = {
  create: async (data, produkID) => {
    return await prisma.$transaction(async (prisma) => {
      const newTransaksi = await prisma.transaksi.create({
        data: {
          tanggal_transaksi: new Date(data.tanggal_transaksi),
          waktu_transaksi: data.waktu_transaksi,
          status_transaksi: data.status_transaksi,
          total_harga: data.total_harga,
          metode_pembayaran: data.metode_pembayaran,
          pembeliID: data.pembeliID,
        },
      });

      const transaksiProdukData = produkID.map((item) => ({
        transaksiID: newTransaksi.no_transaksi,
        produkID: item.produkID,
        jumlah: item.jumlah,
      }));

      await prisma.transaksiProduk.createMany({
        data: transaksiProdukData,
      });

      return newTransaksi;
    });
  },
  findAll: async () => {
    return await prisma.transaksi.findMany({
      include: {
        TransaksiProduk: {
          include: {
            Produk: true,
          },
        },
      },
    });
  },
  findById: async (no_transaksi) => {
    return await prisma.transaksi.findUnique({
      where: { no_transaksi: parseInt(no_transaksi) },
      include: {
        TransaksiProduk: {
          include: {
            Produk: true,
          },
        },
      },
    });
  },
  update: async (no_transaksi, data) => {
    return await prisma.transaksi.update({
      where: { no_transaksi: parseInt(no_transaksi) },
      data: {
        tanggal_transaksi: new Date(data.tanggal_transaksi),
        waktu_transaksi: data.waktu_transaksi,
        status_transaksi: data.status_transaksi,
        total_harga: data.total_harga,
        metode_pembayaran: data.metode_pembayaran,
      },
    });
  },
  delete: async (no_transaksi) => {
    return await prisma.$transaction(async (prisma) => {
      await prisma.transaksiProduk.deleteMany({
        where: { transaksiID: parseInt(no_transaksi) },
      });

      await prisma.transaksi.delete({
        where: { no_transaksi: parseInt(no_transaksi) },
      });
    });
  },
};

module.exports = Transaksi;
