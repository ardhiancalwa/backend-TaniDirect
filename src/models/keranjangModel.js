const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const Produk = require("./produkModel");

const getOrCreateKeranjang = async (pembeliID, keranjangProdukList = []) => {
  let keranjang = await prisma.keranjang.findUnique({
    where: { pembeliID: pembeliID },
    include: {
      KeranjangProduk: true,
    },
  });

  if (!keranjang) {
    keranjang = await prisma.keranjang.create({
      data: {
        pembeliID: pembeliID,
        KeranjangProduk: {
          create: keranjangProdukList.map((produk) => ({
            produkID: produk.produkID,
            jumlah: produk.jumlah,
            total_harga_produk: produk.total_harga_produk,
          })),
        },
      },
      include: {
        KeranjangProduk: true,
      },
    });
  }

  return keranjang;
};

const keranjang = {
  findAll: async () => {
    return await prisma.keranjang.findMany({
      include: {
        Pembeli: true,
        KeranjangProduk: {
          include: {
            Produk: true,
          },
        },
      },
    });
  },
  findByPembeliId: async (pembeliID) => {
    return await prisma.keranjang.findUnique({
      where: { pembeliID: parseInt(pembeliID) },
      include: {
        Pembeli: true,
        KeranjangProduk: {
          include: {
            Produk: true,
          },
        },
      },
    });
  },
  addProdukToKeranjang: async (pembeliID, produkID, jumlah) => {
    const produk = await Produk.findById(produkID);
    if (!produk) {
      throw new NotFoundError("Produk tidak ditemukan");
    }

    const keranjangProdukList = [
      {
        produkID: produkID,
        jumlah: jumlah,
        total_harga_produk: produk.harga * jumlah,
      },
    ];

    const keranjang = await getOrCreateKeranjang(
      pembeliID,
      keranjangProdukList
    );

    const existingProduk = keranjang.KeranjangProduk.find(
      (kp) => kp.produkID === produkID
    );

    let responseData;

    if (existingProduk) {
      const produkInDB = await prisma.produk.findUnique({
        where: { produkID: produkID },
      });

      if (!produkInDB) {
        throw new Error("Produk tidak ditemukan");
      }

      // const initialJumlah = existingProduk.jumlah;
      // if (jumlah === 1) {
      //   existingProduk.jumlah = 0;
      // }

      const updatedProduk = await prisma.keranjangProduk.update({
        where: {
          keranjangID_produkID: {
            keranjangID: keranjang.keranjangID,
            produkID: produkID,
          },
        },
        data: {
          jumlah: existingProduk.jumlah + jumlah, // Update quantity in DB
          total_harga_produk:
            existingProduk.total_harga_produk + produkInDB.harga * jumlah, // Update total price in DB
        },
      });

      // Prepare the response based on the cumulative quantity
      responseData = {
        keranjangID: updatedProduk.keranjangID,
        produkID: updatedProduk.produkID,
        jumlah: updatedProduk.jumlah, // Ensure response reflects only the amount added in this request
        total_harga_produk: produkInDB.harga * jumlah, // Ensure response reflects only the amount added in this request
      };
    } else {
      let multiplier = 1;
      if (produk.berat_produk >= 100) {
        multiplier = 1.75;
      } else if (produk.berat_produk >= 75) {
        multiplier = 1.5;
      } else if (produk.berat_produk >= 50) {
        multiplier = 1.25;
      }

      const totalHargaProduk = produk.harga * multiplier * jumlah;

      const newKeranjangProduk = await prisma.keranjangProduk.create({
        data: {
          keranjangID: keranjang.keranjangID,
          produkID: produkID,
          jumlah: jumlah,
          total_harga_produk: totalHargaProduk,
        },
      });

      // Prepare the response based on the new product added
      responseData = {
        keranjangID: newKeranjangProduk.keranjangID,
        produkID: newKeranjangProduk.produkID,
        jumlah: newKeranjangProduk.jumlah,
        total_harga_produk: newKeranjangProduk.total_harga_produk,
      };
    }

    return responseData;
  },
  update: async (keranjangID, data) => {
    return await prisma.keranjang.update({
      where: { keranjangID: parseInt(keranjangID) },
      data: {
        KeranjangProduk: {
          upsert: data.produk.map((produk) => ({
            where: {
              keranjangID_produkID: {
                keranjangID: parseInt(keranjangID),
                produkID: produk.produkID,
              },
            },
            update: {
              jumlah: produk.jumlah,
              total_harga_produk: produk.total_harga_produk,
            },
            create: {
              produkID: produk.produkID,
              jumlah: produk.jumlah,
              total_harga_produk: produk.total_harga_produk,
            },
          })),
        },
      },
      include: {
        KeranjangProduk: true,
      },
    });
  },
  delete: async (keranjangID) => {
    return await prisma.keranjang.delete({
      where: { keranjangID: parseInt(keranjangID) },
    });
  },
};

module.exports = keranjang;
