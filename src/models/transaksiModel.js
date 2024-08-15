const { PrismaClient } = require("@prisma/client");
// const { findById } = require("./pembeliModel");
const midtransClient = require("midtrans-client");
const prisma = new PrismaClient();
const shortUUID = require("short-uuid");

const Transaksi = {
  createTokenMidtrans: async (pembeli, totalHarga) => {
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    const noTransaksi = `TDIRECT-${shortUUID.generate()}`;

    const midtransTransaction = await snap.createTransaction({
      transaction_details: {
        order_id: noTransaksi,
        gross_amount: totalHarga,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: pembeli.nama_pembeli.split(" ")[0],
        last_name: pembeli.nama_pembeli.split(" ").slice(1).join(" "),
        email: pembeli.email_pembeli,
        phone: pembeli.kontak_pembeli,
      },
    });

    return {
      no_transaksi: noTransaksi,
      midtransToken: midtransTransaction.token,
      redirect_url: midtransTransaction.redirect_url,
    };
  },
  create: async (data, produkID) => {
    return await prisma.$transaction(async (prisma) => {
      let totalHarga = 0;
      for (const item of produkID) {
        const produk = await prisma.produk.findUnique({
          where: { produkID: item.produkID },
        });

        if (!produk) {
          throw new Error(`Product with ID ${item.produkID} not found`);
        }

        if (produk.jumlah_stok < item.jumlah) {
          throw new Error(
            `Insufficient stock for product ${produk.nama_produk}`
          );
        }

        // Calculate total price
        totalHarga += produk.harga * item.jumlah;
      }

      const newTransaksi = await prisma.transaksi.create({
        data: {
          no_transaksi: data.no_transaksi,
          tanggal_transaksi: new Date(data.tanggal_transaksi),
          status_transaksi: "success",
          total_harga: totalHarga,
          metode_pembayaran: data.metode_pembayaran,
          pembeliID: data.pembeliID,
        },
      });

      const transaksiProdukData = produkID.map((item) => ({
        transaksiID: newTransaksi.no_transaksi,
        produkID: item.produkID,
        jumlah: item.jumlah,
        berat_produk: item.berat_produk,
      }));

      for (const item of produkID) {
        const produk = await prisma.produk.findUnique({
          where: { produkID: item.produkID },
        });

        if (!produk) {
          throw new Error(`Product with ID ${item.produkID} not found`);
        }

        if (produk.jumlah_stok < item.jumlah) {
          throw new Error(
            `Insufficient stock for product ${produk.nama_produk}`
          );
        }

        await prisma.produk.update({
          where: { produkID: item.produkID },
          data: { jumlah_stok: produk.jumlah_stok - item.jumlah },
        });
      }

      await prisma.transaksiProduk.createMany({
        data: transaksiProdukData,
      });

      return {
        transaksi: newTransaksi,
      };
    });
  },
  findAll: async () => {
    const transaksi = await prisma.transaksi.findMany({
      include: {
        TransaksiProduk: {
          include: {
            Produk: true,
          },
        },
      },
    });

    const productSales = {};

    transaksi.forEach((trans) => {
      trans.TransaksiProduk.forEach((transProd) => {
        const { produkID, jumlah } = transProd;
        if (productSales[produkID]) {
          productSales[produkID] += jumlah;
        } else {
          productSales[produkID] = jumlah;
        }
      });
    });

    const products = await prisma.produk.findMany();

    const productDetails = products.map((product) => ({
      ...product,
      totalSold: productSales[product.produkID] || 0,
    }));

    return {
      transaksi,
      productDetails,
    };
  },
  findById: async (no_transaksi) => {
    return await prisma.transaksi.findUnique({
      where: { no_transaksi: no_transaksi },
      include: {
        TransaksiProduk: {
          include: {
            Produk: true,
          },
        },
      },
    });
  },
  findProdukByPembeliId: async (pembeliID) => {
    return await prisma.transaksi.findMany({
      where: {
        pembeliID: parseInt(pembeliID),
      },
      include: {
        TransaksiProduk: {
          select: {
            Transaksi: true,
            Produk: true,
            berat_produk: true,
            jumlah: true,
          },
        },
      },
    });
  },
  findRecomendationsProdukbyTotalSold: async () => {
    const transactions = await prisma.transaksi.findMany({
        include: {
            TransaksiProduk: {
                include: {
                    Produk: true,
                },
            },
        },
    });

    // Calculate total sales for each product
    const productSales = {};
    transactions.forEach((transaction) => {
        transaction.TransaksiProduk.forEach((transProd) => {
            const { produkID, jumlah } = transProd;
            if (productSales[produkID]) {
                productSales[produkID] += jumlah;
            } else {
                productSales[produkID] = jumlah;
            }
        });
    });

    // Convert the productSales object to an array and sort it by totalSold
    const sortedProductSales = Object.entries(productSales)
        .map(([produkID, totalSold]) => ({ produkID: parseInt(produkID), totalSold }))
        .sort((a, b) => b.totalSold - a.totalSold);

    // Fetch the product details for the sorted products
    const sortedProductDetails = await Promise.all(
        sortedProductSales.map(async ({ produkID, totalSold }) => {
            const product = await prisma.produk.findUnique({
                where: { produkID },
            });
            return { ...product, totalSold };
        })
    );

    return sortedProductDetails;
},
  delete: async (no_transaksi) => {
    return await prisma.$transaction(async (prisma) => {
      await prisma.transaksiProduk.deleteMany({
        where: { transaksiID: no_transaksi },
      });

      await prisma.transaksi.delete({
        where: { no_transaksi: no_transaksi },
      });
    });
  },
};

module.exports = Transaksi;
