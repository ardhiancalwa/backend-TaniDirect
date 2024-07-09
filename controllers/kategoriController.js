const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllKategori = async (req, res, next) => {
  try {
    const data = await prisma.kategori.findMany();
    if (data.length === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }
    res.json({
      status: "success",
      message: "Data kategori berhasil ditemukan",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

exports.addKategori = async (req, res, next) => {
  try {
    const { nama_kategori } = req.body;
    const newKategori = await prisma.kategori.create({
      data: { nama_kategori },
    });
    res.status(201).json({
      status: "success",
      message: "Kategori berhasil ditambahkan",
      data: newKategori,
    });
  } catch (error) {
    next(error);
  }
};

exports.getKategoriById = async (req, res, next) => {
  try {
    const { kategoriID } = req.params;
    const kategori = await prisma.kategori.findUnique({
      where: { kategoriID: parseInt(kategoriID) },
    });
    if (!kategori) {
      return res.status(404).json({ error: "Kategori tidak ditemukan" });
    }
    res.status(200).json({
      status: "success",
      message: "Kategori berhasil ditemukan",
      data: kategori,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateKategori = async (req, res, next) => {
  const { kategoriID } = req.params;
  const { nama_kategori } = req.body;
  try {
    const updatedKategori = await prisma.kategori.update({
      where: { kategoriID: parseInt(kategoriID) },
      data: { nama_kategori },
    });
    res.status(200).json({
      status: "success",
      message: "Kategori berhasil di update",
      updatedKategori,
    });
  } catch (error) {
    if (error.code === "P2025") {
      // Handle record not found error
      return res.status(404).json({
        status: "error",
        message: "Kategori tidak ditemukan",
      });
    }
    next(error);
  }
};

exports.deleteKategori = async (req, res, next) => {
  try {
    const { kategoriID } = req.params;
    await prisma.kategori.delete({
      where: { kategoriID: parseInt(kategoriID) },
    });
    res.status(200).json({
      status: "success",
      message: "Kategori berhasil dihapus",
    });
  } catch (error) {
    if (error.code === "P2025") {
      // Handle record not found error
      return res.status(404).json({
        status: "error",
        message: "Kategori tidak ditemukan",
      });
    }
    next(error);
  }
};
