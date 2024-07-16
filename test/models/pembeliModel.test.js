const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    pembeli: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

const Pembeli = require("../../src/models/pembeliModel");

describe("Pembeli Model", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll", () => {
    it("should return all pembeli", async () => {
      const mockPembeli = [{ pembeliID: 1, nama_pembeli: "John Doe" }];
      prisma.pembeli.findAll.mockResolvedValue(mockPembeli);
      const result = await Pembeli.findAll();
      expect(result).toEqual(mockPembeli);
      expect(prisma.pembeli.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("findById", () => {
    it("should return  pembeli by ID", async () => {
      const mockPembeli = { pembeliID: 1, nama_pembeli: "John Doe" };
      prisma.pembeli.findById.mockResolvedValue(mockPembeli);

      const result = await Pembeli.findById(1);
      expect(result).toEqual(mockPembeli);
      expect(prisma.pembeli.findById).toHaveBeenCalledTimes(1);
      expect(prisma.pembeli.findUnique).toHaveBeenCalledWith({
        where: { pembeliID: 1 },
      });
    });
  });

  describe("create", () => {
    it("should create a new pembeli", async () => {
      const mockPembeliData = {
        nama_pembeli: "John Doe",
        email_pembeli: "johndoe@example.com",
        password_pembeli: "password123",
        alamat_pembeli: "123 Street",
        kontak_pembeli: "1234567890",
      };

      const hashedPassword = await bcrypt.hash(
        mockPembeliData.password_pembeli,
        10
      );

      const mockNewPembeli = {
        pembeliID: 1,
        ...mockPembeliData,
        password_pembeli: hashedPassword,
      };

      prisma.pembeli.create.mockResolvedValue(mockNewPembeli);

      const result = await Pembeli.create(mockPembeliData);
      expect(result).toEqual(mockNewPembeli);
      expect(prisma.pembeli.create).toHaveBeenCalledTimes(1);
      expect(prisma.pembeli.create).toHaveBeenCalledWith({
        data: {
          ...mockPembeliData,
          password_pembeli: hashedPassword,
        },
      });
    });
  });

  describe("update", () => {
    it("should update a pembeli", async () => {
      const mockUpdateData = {
        nama_pembeli: "Jane Doe",
        password_pembeli: "newpassword",
      };
      const hashedPassword = await bcrypt.hash(
        mockUpdateData.password_pembeli,
        10
      );
      const mockUpdatedPembeli = {
        pembeliID: 1,
        nama_pembeli: "Jane Doe",
        password_pembeli: hashedPassword,
      };
      prisma.pembeli.update.mockResolvedValue(mockUpdatedPembeli);
      const result = await Pembeli.update(1, mockUpdateData);
      expect(result).toEqual(mockUpdatedPembeli);
      expect(prisma.pembeli.update).toHaveBeenCalledTimes(1);
      expect(prisma.pembeli.update).toHaveBeenCalledWith({
        where: { pembeliID: 1 },
        data: { ...mockUpdateData, password_pembeli: hashedPassword },
      });
    });
  });

  describe('delete', () => { 
    it('should delete a pembeli', async () => {
      const mockDeletedPembeli = { pembeliID: 1, nama_pembeli: 'John Doe' };
      prisma.pembeli.delete.mockResolvedValue(mockDeletedPembeli);
      
      const result = await Pembeli.delete(1);
      expect(result).toEqual(mockDeletedPembeli);
      expect(prisma.pembeli.delete).toHaveBeenCalledTimes(1);
      expect(prisma.pembeli.delete).toHaveBeenCalledWith({
        where: { pembeliID: 1 },
      });
    });
   })
});
