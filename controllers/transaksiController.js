const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new transaction
exports.createTransaksi = async (req, res, next) => {
  const {
    tanggal_transaksi,
    waktu_transaksi,
    status_transaksi,
    total_harga,
    metode_pembayaran,
    pembeliID,
    produkID, // Array of objects with produkID and jumlah
  } = req.body;

  try {
    if (!Array.isArray(produkID) || produkID.some(item => !item.produkID || !item.jumlah)) {
      return res.status(400).json({ error: 'produkID must be an array of objects with produkID and jumlah' });
    }

    // Mulai transaksi
    const result = await prisma.$transaction(async (prisma) => {
      // Buat transaksi baru
      const newTransaksi = await prisma.transaksi.create({
        data: {
          tanggal_transaksi: new Date(tanggal_transaksi),
          waktu_transaksi,
          status_transaksi,
          total_harga,
          metode_pembayaran,
          pembeliID,
        },
      });

      // Tambahkan produk ke transaksi
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

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating transaction:', error);
    next(error);
  }
};


// Get all transactions
// Get all transactions
exports.getAllTransaksi = async (req, res) => {
  try {
    const transaksi = await prisma.transaksi.findMany({
      include: {
        TransaksiProduk: {
          include: {
            Produk: true,
          },
        },
      },
    });
    res.status(200).json(transaksi);
  } catch (error) {
    res.status(500).json({ error: "Error fetching transactions" });
  }
};

// Get a single transaction by ID
exports.getTransaksiById = async (req, res) => {
  const { id } = req.params;

  try {
    const transaksi = await prisma.transaksi.findUnique({
      where: { no_transaksi: parseInt(id) },
      include: {
        TransaksiProduk: {
          include: {
            Produk: true,
          },
        },
      },
    });
    if (!transaksi)
      return res.status(404).json({ error: "Transaction not found" });

    res.status(200).json(transaksi);
  } catch (error) {
    res.status(500).json({ error: "Error fetching transaction" });
  }
};

// Update a transaction by ID
exports.updateTransaksi = async (req, res) => {
  const { id } = req.params;
  const {
    tanggal_transaksi,
    waktu_transaksi,
    status_transaksi,
    total_harga,
    metode_pembayaran,
  } = req.body;

  try {
    const updatedTransaksi = await prisma.transaksi.update({
      where: { no_transaksi: parseInt(id) },
      data: {
        tanggal_transaksi: new Date(tanggal_transaksi),
        waktu_transaksi,
        status_transaksi,
        total_harga,
        metode_pembayaran,
      },
    });
    res.status(200).json(updatedTransaksi);
  } catch (error) {
    res.status(500).json({ error: "Error updating transaction" });
  }
};

// Delete a transaction by ID
exports.deleteTransaksi = async (req, res, next) => {
  const { no_transaksi } = req.params;

  try {
    await prisma.$transaction(async (prisma) => {
      // Hapus semua entri terkait di TransaksiProduk
      await prisma.transaksiProduk.deleteMany({
        where: { transaksiID: parseInt(no_transaksi) },
      });

      // Hapus entri di Transaksi
      await prisma.transaksi.delete({
        where: { no_transaksi: parseInt(no_transaksi) },
      });
    });

    res.status(204).send({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    next(error);
  }
};
