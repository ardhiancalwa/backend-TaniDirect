const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllPromo = async (req, res, next) => {
  try {
    const promo = await prisma.promo.findMany();
    res.status(200).json(promo);
  } catch (error) {
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
    res.status(201).json(newPromo);
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
    res.status(200).json(promo);
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
    res.status(200).json(updatedPromo);
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
    res.status(200).json({ message: "Promo berhasil dihapus" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Promo tidak ditemukan" });
    }
    next(error);
  }
};
