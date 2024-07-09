const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllPromo = async (req, res, next) => {
  try {
    const promo = await prisma.promo.findMany();
    if (promo.length === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }
    res.status(200).json({
      status: "success",
      message: "Promo berhasil ditemukan",
      data: promo,
    });
  } catch (error) {
    if (error.code === "P2025") {
      // Handle record not found error
      return res.status(404).json({
        status: "error",
        message: "Promo tidak ditemukan",
      });
    }
    next(error);
  }
};

exports.addPromo = async (req, res, next) => {
  try {
    const { nama_promo, deskripsi_promo, tanggal_dimulai, tanggal_berakhir } =
      req.body;
    const newPromo = await prisma.promo.create({
      data: {
        nama_promo,
        deskripsi_promo,
        tanggal_dimulai: new Date(tanggal_dimulai),
        tanggal_berakhir: new Date(tanggal_berakhir),
      },
    });
    res.status(201).json({
      status: "success",
      message: "Promo berhasil ditambahkan",
      data: newPromo,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPromoByNama = async (req, res, next) => {
  try {
    const { nama_promo } = req.params;
    const promo = await prisma.promo.findUnique({
      where: { nama_promo },
    });
    if (!promo) {
      return res.status(404).json({ error: "Promo tidak ditemukan" });
    }
    res.status(200).json({
      status: "success",
      message: "Promo berhasil ditemukan",
      data: promo,
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePromo = async (req, res, next) => {
  try {
    const { nama_promo } = req.params;
    const { deskripsi_promo, tanggal_dimulai, tanggal_berakhir } = req.body;
    const updatedPromo = await prisma.promo.update({
      where: { nama_promo },
      data: {
        deskripsi_promo,
        tanggal_dimulai: new Date(tanggal_dimulai),
        tanggal_berakhir: new Date(tanggal_berakhir),
      },
    });
    res.status(200).json({
      status: "success",
      message: "Promo berhasil diupdate",
      data: updatedPromo,
    });
  } catch (error) {
    next(error);
  }
};

exports.deletePromo = async (req, res, next) => {
  try {
    const { nama_promo } = req.params;
    await prisma.promo.delete({
      where: { nama_promo },
    });
    res.status(200).json({
      status: "success",
      message: "Promo berhasil dihapus",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Promo tidak ditemukan" });
    }
    next(error);
  }
};
