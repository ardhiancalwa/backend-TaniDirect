const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllProduk = async (req, res, next) => {
  try {
    const { sort, order } = req.query;

    // Define a set of valid fields for sorting
    const validSortFields = [
      "nama_produk",
      "deskripsi_produk",
      "image_produk",
      "harga",
      "jumlah_stok",
      "kategoriID",
      "createdAt",
      "updatedAt",
    ];

    // Use a valid field for sorting, defaulting to "nama_produk"
    const sortField = validSortFields.includes(sort) ? sort : "harga";
    const sortOrder = { [sortField]: order || "asc" };

    const produk = await prisma.produk.findMany({
      orderBy: sortOrder,
      include: {
        Kategori: true, 
      },
    });

    const formattedProduk = produk.map(p => ({
      produkID: p.produkID,
      kategoriID: p.kategoriID,
      nama_produk: p.nama_produk,
      deskripsi_produk: p.deskripsi_produk,
      image_produk : p.image_produk,
      jumlah_stok: p.jumlah_stok,
      harga: p.harga,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      Kategori: p.Kategori
    }));

    res.status(200).json(formattedProduk);
  } catch (error) {
    next(error);
  }
};

exports.addProduk = async (req, res, next) => {
  try {
    const { kategoriID, nama_produk, deskripsi_produk, image_produk, harga, jumlah_stok } = req.body;

    const newProduk = await prisma.produk.create({
      data: {
        kategoriID: parseInt(kategoriID, 10),
        nama_produk,
        deskripsi_produk,
        image_produk,
        harga: parseFloat(harga),
        jumlah_stok: parseInt(jumlah_stok, 10),
      },
    });
    
    res.status(201).json(newProduk);
  } catch (error) {
    next(error);
  }
};

exports.searchProduk = async (req, res, next) => {
  try {
    const { nama_produk } = req.query;
    const produk = await prisma.produk.findMany({
      where: { nama_produk: { contains: nama_produk } },
    });
    if (produk.length === 0) {
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    }
    res.status(200).json(produk);
  } catch (error) {
    next(error);
  }
};

exports.getProdukById = async (req, res, next) => {
  try {
    const { produkID } = req.params;
    const produk = await prisma.produk.findUnique({
      where: { produkID: parseInt(produkID) },
    });
    if (!produk) {
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    }
    res.status(200).json(produk);
  } catch (error) {
    next(error);
  }
};

exports.updateProduk = async (req, res, next) => {
  try {
    const { produkID } = req.params;
    const { deskripsi_produk, image_produk, harga, jumlah_stok, nama_produk, kategoriID } =
      req.body;
    const updatedProduk = await prisma.produk.update({
      where: { produkID: parseInt(produkID) },
      data: {
        kategoriID: parseInt(kategoriID, 10),
        nama_produk,
        deskripsi_produk,
        image_produk,
        harga: parseFloat(harga),
        jumlah_stok: parseInt(jumlah_stok, 10),
      },
    });
    res.status(200).json(updatedProduk);
  } catch (error) {
    next(error);
  }
};

exports.deleteProduk = async (req, res, next) => {
  try {
    const { produkID } = req.params;
    await prisma.produk.delete({ where: { produkID: parseInt(produkID) } });
    res.status(200).json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};
