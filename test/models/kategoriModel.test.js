const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    kategori: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

const Kategori = require("../../src/models/kategoriModel");

describe("Kategori Model", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("should return all data", async () => {
      const mockKategori = [{ kategoriID: 1, nama_kategori: "Makanan" }];
      prisma.kategori.findMany.mockResolvedValueOnce(mockKategori);
      const result = await Kategori.findAll();
      expect(result).toEqual(mockKategori);
      expect(prisma.kategori.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("findById", () => {
    it("should return kategori by ID", async () => {
      const mockKategori = { kategoriID: 1, nama_kategori: "Makanan" };
      prisma.kategori.findUnique.mockResolvedValueOnce(mockKategori);
      const result = await Kategori.findById(1);
      expect(result).toEqual(mockKategori);
      expect(prisma.kategori.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.kategori.findUnique).toHaveBeenCalledWith({
        where: { kategoriID: 1 },
      });
    });
  });

  describe("create", () => {
    it("shuould create a new kategori", async () => {
      const mockKategoriData = {
        nama_kategori: "Makanan",
      };

      const mockNewKategori = {
        kategoriID: 1,
        ...mockKategoriData,
      };

      prisma.kategori.create.mockResolvedValueOnce(mockNewKategori);
      const result = await Kategori.create(mockKategoriData);
      expect(result).toEqual(mockNewKategori);
      expect(prisma.kategori.create).toHaveBeenCalledTimes(1);
      expect(prisma.kategori.create).toHaveBeenCalledWith({
        data: mockKategoriData,
      });
    });
  });

  describe("update", () => {
    it("should update a katagori", () => {
      const mockUpdateData = {
        nama_kategori: "Minuman",
      };
      const mockUpdateKategori = {
        kategoriID: 1,
        nama_kategori: "Minuman",
      };

      prisma.kategori.update.mockResolvedValueOnce(mockUpdateKategori);

      const result = Kategori.update(1, mockUpdateData);
      expect(result).toEqual(mockUpdateKategori);
      expect(prisma.kategori.update).toHaveBeenCalledTimes(1);
      expect(prisma.kategori.update).toHaveBeenCalledWith({
        where: { kategoriID: 1 },
        data: mockUpdateData,
      });
    });
  });

  describe("delete", () => {
    it("should delete a kategori", async () => {
      const mockDeletedKategori = {
        kategoriID: 1,
        nama_kategori: "Makanan",
      };
      prisma.kategori.delete.mockResolvedValueOnce(mockDeletedKategori);
      const result = await Kategori.delete(1);
      expect(result).toEqual(mockDeletedKategori);
      expect(prisma.kategori.delete).toHaveBeenCalledTimes(1);
      expect(prisma.kategori.delete).toHaveBeenCalledWith({
        where: { kategoriID: 1 },
      });
    });
  });
});
