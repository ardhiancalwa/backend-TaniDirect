const { PrismaClient } = require("@prisma/client");
const midtransClient = require("midtrans-client");
const prisma = new PrismaClient();
const shortUUID = require("short-uuid");

const Transaksi = {
  // createTokenMidtrans: async (pembeli, totalHarga, noTransaksi) => {
  //   const snap = new midtransClient.Snap({
  //     isProduction: false,
  //     serverKey: process.env.MIDTRANS_SERVER_KEY,
  //   });

  //   // const noTransaksi = `TDIRECT-${shortUUID.generate()}`;

  //   const midtransTransaction = await snap.createTransaction({
  //     transaction_details: {
  //       order_id: noTransaksi,
  //       gross_amount: totalHarga,
  //     },
  //     credit_card: {
  //       secure: true,
  //     },
  //     customer_details: {
  //       first_name: pembeli.nama_pembeli.split(" ")[0],
  //       last_name: pembeli.nama_pembeli.split(" ").slice(1).join(" "),
  //       email: pembeli.email_pembeli,
  //       phone: pembeli.kontak_pembeli,
  //     },
  //   });

  //   return {
  //     no_transaksi: noTransaksi,
  //     midtransToken: midtransTransaction.token,
  //     redirect_url: midtransTransaction.redirect_url,
  //   };
  // },
  // create: async (data, produkID) => {
  //   return await prisma.$transaction(async (prisma) => {
  //     let totalHarga = 0;
  //     for (const item of produkID) {
  //       const produk = await prisma.produk.findUnique({
  //         where: { produkID: item.produkID },
  //       });
    
  //       if (!produk) {
  //         throw new Error(`Product with ID ${item.produkID} not found`);
  //       }
    
  //       if (produk.jumlah_stok < item.jumlah) {
  //         throw new Error(`Insufficient stock for product ${produk.nama_produk}`);
  //       }
    
  //       totalHarga += produk.harga * item.jumlah;
  //     }
    
  //     // Generate the transaction number
  //     const noTransaksi = `TDIRECT-${shortUUID.generate()}`;
  //     console.log('Generated noTransaksi in create:', noTransaksi);
      
  //     const pembeli = await prisma.pembeli.findUnique({
  //       where: { pembeliID: data.pembeliID },
  //     });
      
  //     if (!pembeli) {
  //       throw new Error(`Pembeli with ID ${data.pembeliID} not found`);
  //     }
    
  //     const newTransaksi = await prisma.transaksi.create({
  //       data: {
  //         no_transaksi: noTransaksi,
  //         tanggal_transaksi: new Date(data.tanggal_transaksi),
  //         status_transaksi: "pending",
  //         total_harga: totalHarga,
  //         metode_pembayaran: data.metode_pembayaran,
  //         pembeliID: data.pembeliID,
  //       },
  //     });
    
  //     const transaksiProdukData = produkID.map((item) => ({
  //       transaksiID: newTransaksi.no_transaksi,
  //       produkID: item.produkID,
  //     }));
    
  //     for (const item of produkID) {
  //       const produk = await prisma.produk.findUnique({
  //         where: { produkID: item.produkID },
  //       });
    
  //       await prisma.produk.update({
  //         where: { produkID: item.produkID },
  //         data: { jumlah_stok: produk.jumlah_stok - item.jumlah },
  //       });
  //     }
    
  //     await prisma.transaksiProduk.createMany({
  //       data: transaksiProdukData,
  //     });
    
  //     // Generate Midtrans token
  //     const midtransTokenData = await Transaksi.createTokenMidtrans(pembeli, totalHarga, noTransaksi);
    
  //     return {
  //       transaksi: newTransaksi,
  //       midtrans: midtransTokenData,
  //     };
  //   });
  // },
  createAndGenerateToken: async (data, produkID) => {
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
          throw new Error(`Insufficient stock for product ${produk.nama_produk}`);
        }
  
        totalHarga += produk.harga * item.jumlah;
      }
  
      // Generate the transaction number
      const noTransaksi = `TDIRECT-${shortUUID.generate()}`;
      
      const pembeli = await prisma.pembeli.findUnique({
        where: { pembeliID: data.pembeliID },
      });
  
      if (!pembeli) {
        throw new Error(`Pembeli with ID ${data.pembeliID} not found`);
      }
  
      const newTransaksi = await prisma.transaksi.create({
        data: {
          no_transaksi: noTransaksi,
          tanggal_transaksi: new Date(),
          status_transaksi: "pending",
          total_harga: totalHarga,
          metode_pembayaran: data.metode_pembayaran,
          pembeliID: data.pembeliID,
        },
      });
  
      const transaksiProdukData = produkID.map((item) => ({
        transaksiID: newTransaksi.no_transaksi,
        produkID: item.produkID,
        jumlah: item.jumlah,
      }));
  
      for (const item of produkID) {
        const produk = await prisma.produk.findUnique({
          where: { produkID: item.produkID },
        });
  
        await prisma.produk.update({
          where: { produkID: item.produkID },
          data: { jumlah_stok: produk.jumlah_stok - item.jumlah },
        });
      }
  
      await prisma.transaksiProduk.createMany({
        data: transaksiProdukData,
      });
  
      // Generate Midtrans token
      const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
      });
  
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
        transaksi: newTransaksi,
        midtrans: {
          no_transaksi: noTransaksi,
          midtransToken: midtransTransaction.token,
          redirect_url: midtransTransaction.redirect_url,
        },
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
        console.log(`Product ID: ${produkID}, Jumlah Terjual: ${jumlah}`);
        
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
