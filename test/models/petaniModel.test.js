const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

// jest.mock(...) untuk memalsukan @prisma/client dalam lingkungan testing menggunakan jest
jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    petani: {
      // setiap metode nya ini di mock menggunakan jest.fn()
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  // mockPrismaClient adalah object yang berisi metode diatas yang udah di mock
  // PrismaClient adalah fungsi konstruktor dari modul @prisma/client yang di mock untuk mengembalikan mockPrismaClient
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

const Petani = require("../../src/models/petaniModel");

//describe('Petani Model'... digunakan untuk mengelompokkan testing yang diambil dari model "petani"
describe("Petani Model", () => {
  //jest.clearAllMocks digunakan untuk menghapus semua mocks untuk memastikan bahwa setiap mock yang dibuat sebelumnya tidak
  // memengaruhi testing selanjutnya
  afterEach(() => {
    jest.clearAllMocks();
  });

  // testing model petani findAll
  describe("findAll", () => {
    // test case
    it("should return all petani", async () => {
      // mockPetani nya ini data palsu yang dikembalikan oleh `prisma.petani.findMany()` dalam metode findAll
      const mockPetani = [{ petaniID: 1, nama_petani: "John Doe" }];
      prisma.petani.findMany.mockResolvedValue(mockPetani);

      const result = await Petani.findAll();
      // memeriksa apakah nilai yang dikembalikan sesuai dengan mockPetani yang diharapkan
      expect(result).toEqual(mockPetani);
      // mmemastikan telat dipanggil tepat 1 kali selama testing berjalan
      expect(prisma.petani.findMany).toHaveBeenCalledTimes(1);
    });
  });

  // testing model petani findById
  describe("findById", () => {
    // test case
    it("should return petani by ID", async () => {
      // untuk mock metode findUnique
      const mockPetani = { petaniID: 1, nama_petani: "John Doe" };
      prisma.petani.findUnique.mockResolvedValue(mockPetani);

      const result = await Petani.findById(1);
      // memeriksa apakah nilai yang dikembalikan oleh findById sesuai dengan mockPetani yang diharapkan
      expect(result).toEqual(mockPetani);
      // memastikan telah dipanggil tepat 1 kali selama testing berlangsung
      expect(prisma.petani.findUnique).toHaveBeenCalledTimes(1);
      // memeriksa pencarian berdasarkan ID apakah sudah benar
      expect(prisma.petani.findUnique).toHaveBeenCalledWith({
        where: { petaniID: 1 },
      });
    });
  });

  describe("create", () => {
    it("should create a new petani", async () => {
      const mockPetaniData = {
        nama_petani: "John Doe",
        alamat_petani: "123 Street",
        no_telepon_petani: "1234567890",
        email_petani: "john@example.com",
        password_petani: "password123",
      };

      const hashedPassword = await bcrypt.hash(
        mockPetaniData.password_petani,
        10
      );

      const mockNewPetani = {
        petaniID: 1,
        ...mockPetaniData,
        password_petani: hashedPassword,
      };

      prisma.petani.create.mockResolvedValue(mockNewPetani);

      const result = await Petani.create(mockPetaniData);
      expect(result).toEqual(mockNewPetani);
      expect(prisma.petani.create).toHaveBeenCalledTimes(1);
      expect(prisma.petani.create).toHaveBeenCalledWith({
        data: { ...mockPetaniData, password_petani: hashedPassword },
      });
    });
  });

  describe("update", () => {
    it("should update a petani", async () => {
      const mockUpdateData = {
        nama_petani: "Jane Doe",
        password_petani: "newpassword",
      };
      const hashedPassword = await bcrypt.hash(
        mockUpdateData.password_petani,
        10
      );
      const mockUpdatedPetani = {
        petaniID: 1,
        nama_petani: "Jane Doe",
        password_petani: hashedPassword,
      };

      prisma.petani.update.mockResolvedValue(mockUpdatedPetani);

      const result = await Petani.update(1, mockUpdateData);
      expect(result).toEqual(mockUpdatedPetani);
      expect(prisma.petani.update).toHaveBeenCalledTimes(1);
      expect(prisma.petani.update).toHaveBeenCalledWith({
        where: { petaniID: 1 },
        data: { ...mockUpdateData, password_petani: hashedPassword },
      });
    });
  });

  describe("delete", () => {
    it("should delete a petani", async () => {
      const mockDeletedPetani = { petaniID: 1, nama_petani: "John Doe" };
      prisma.petani.delete.mockResolvedValue(mockDeletedPetani);

      const result = await Petani.delete(1);
      expect(result).toEqual(mockDeletedPetani);
      expect(prisma.petani.delete).toHaveBeenCalledTimes(1);
      expect(prisma.petani.delete).toHaveBeenCalledWith({
        where: { petaniID: 1 },
      });
    });
  });
});
