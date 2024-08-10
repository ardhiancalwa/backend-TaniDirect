const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

const Petani = {
  findAll: async () => {
    return await prisma.petani.findMany();
  },
  findById: async (petaniID) => {
    return await prisma.petani.findUnique({
      where: { petaniID: parseInt(petaniID) },
    });
  },
  findByEmail: async (email_petani) => {
    return await prisma.petani.findUnique({
      where: { email_petani },
    });
  },
  create: async (data) => {
    return await prisma.petani.create({data});
  },
  update: async (petaniID, data) => {
    if (data.password_petani) {
      data.password_petani = await bcrypt.hash(data.password_petani, 10);
    }
    return await prisma.petani.update({
      where: { petaniID: parseInt(petaniID) },
      data,
    });
  },
  delete: async (petaniID) => {
    return await prisma.petani.delete({
      where: { petaniID: parseInt(petaniID) },
    });
  },
};

module.exports = Petani;
