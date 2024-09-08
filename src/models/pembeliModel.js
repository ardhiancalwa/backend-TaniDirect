const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../utils/cloudinary");

const Pembeli = {
  findAll: async () => {
    return await prisma.pembeli.findMany();
  },
  findById: async (pembeliID) => {
  return await prisma.pembeli.findUnique({
      where: { pembeliID: parseInt(pembeliID) },
    });
  },
  findByEmail: async (email_pembeli) => {
    return await prisma.pembeli.findUnique({
      where: { email_pembeli },
    });
  },
  create: async (data) => {
    return await prisma.pembeli.create({ data });
  }, 
  update: async (pembeliID, data, file) => {
    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "user",
        public_id: `${pembeliID}-${Date.now()}`,
      });
      data.image_pembeli = result.public_id + "." + result.format;
    }

    if (data.password_pembeli) {
      data.password_pembeli = await bcrypt.hash(data.password_pembeli, 10);
    }

    try {
      return await prisma.pembeli.update({
        where: { pembeliID: parseInt(pembeliID) },
        data,
      });
    } catch (err) {
      throw new Error("Failed to update user data");
    }
  },
  delete: async (pembeliID) => {
    return await prisma.pembeli.delete({
      where: { pembeliID: parseInt(pembeliID) },
    });
  },
};

module.exports = Pembeli;
