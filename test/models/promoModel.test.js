const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    promo: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

const Promo = require("../../src/models/promoModel");

describe("Promo Model", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("should return all promo", async () => {
      const mockPromo = [
        {
          nama_promo: "Promo1",
          deskripsi_promo: "Deskripsi1",
          tanggal_dimulai: new Date(),
          tanggal_berakhir: new Date(),
        },
        {
          nama_promo: "Promo2",
          deskripsi_promo: "Deskripsi2",
          tanggal_dimulai: new Date(),
          tanggal_berakhir: new Date(),
        },
      ];
      prisma.promo.findMany.mockResolvedValue(mockPromo);

      const result = await Promo.findAll();
      expect(result).toEqual(mockPromo);
      expect(prisma.promo.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("findByName", () => {
    it("should return a promo by name", async () => {
      const mockPromo = {
        nama_promo: "Promo1",
        deskripsi_promo: "Deskripsi1",
        tanggal_dimulai: new Date(),
        tanggal_berakhir: new Date(),
      };
      prisma.promo.findUnique.mockResolvedValue(mockPromo);

      const result = await Promo.findByName("Promo1");
      expect(result).toEqual(mockPromo);
      expect(prisma.promo.findUnique).toHaveBeenCalledWith({
        where: { nama_promo: "Promo1" },
      });
      expect(prisma.promo.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe("create", () => {
    it("should create a new promo", async () => {
      const mockPromoData = {
        nama_promo: "Promo1",
        deskripsi_promo: "Deskripsi1",
        tanggal_dimulai: new Date(),
        tanggal_berakhir: new Date(),
      };
      const mockNewPromo = {
        nama_promo: "Promo1",
        ...mockPromoData,
      };
      prisma.promo.create.mockResolvedValue(mockNewPromo);

      const result = await Promo.create(mockPromoData);
      expect(result).toEqual(mockNewPromo);
      expect(prisma.promo.create).toHaveBeenCalledWith({
        data: mockPromoData,
      });
      expect(prisma.promo.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("update", () => {
    it("should update an existing promo", async () => {
      const mockUpdateData = {
        nama_promo: "Promo1",
        deskripsi_promo: "Updated Deskripsi",
        tanggal_dimulai: new Date(),
        tanggal_berakhir: new Date(),
      };
      const mockUpdatePromo = {
        deskripsi_promo: "Updated Deskripsi",
        tanggal_dimulai: new Date(),
        tanggal_berakhir: new Date(),
      };
      prisma.promo.update.mockResolvedValue(mockUpdatePromo);

      const promo = await Promo.update("Promo1", mockUpdateData);
      expect(result).toEqual(mockUpdatePromo);
      expect(prisma.promo.update).toHaveBeenCalledWith({
        where: { nama_promo: "Promo1" },
        data: mockUpdateData,
      });
      expect(prisma.promo.update).toHaveBeenCalledTimes(1);
    });
  });

  describe("delete", () => {
    it("should delete an existing promo", async () => {
      const mockDeletedPromo = {
        nama_promo: "Promo1",
        deskripsi_promo: "Deskripsi1",
        tanggal_dimulai: new Date(),
        tanggal_berakhir: new Date(),
      };
      prisma.promo.delete.mockResolvedValue(mockDeletedPromo);

      const result = await Promo.delete("Promo1");
      expect(result).toEqual(mockDeletedPromo);
      expect(prisma.promo.delete).toHaveBeenCalledWith({
        where: { nama_promo: "Promo1" },
      });
      expect(prisma.promo.delete).toHaveBeenCalledTimes(1);
    });
  });
});
