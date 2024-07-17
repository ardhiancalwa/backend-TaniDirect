const Kategori = require("../../src/models/kategoriModel");
const kategoriService = require("../../src/services/kategoriService");
const Joi = require("joi");

jest.mock("../../src/models/kategoriModel");

describe("katagoriService", () => {
  describe("getAllKategori", () => {
    it("should return all kategori", async () => {
      const mockKategori = [{ kategoriID: 1, nama_kategori: "Makanan" }];
      Kategori.findAll.mockResolvedValue(mockKategori);

      const result = await kategoriService.getAllKategori();
      expect(result).toEqual(mockKategori);
    });

    it("should throw an error if no kategori is found", async () => {
      Kategori.findAll.mockResolvedValue([]);
      await expect(kategoriService.getAllKategori()).rejects.toThrow(
        "Data kategori tidak ditemukan"
      );
    });
  });

  describe("getKategoriById", () => {
    it("should return kategori by ID", async () => {
      const mockKategori = { kategoriID: 1, nama_kategori: "Makanan" };
      Kategori.findById.mockResolvedValue(mockKategori);

      const result = await kategoriService.getKategoriById(1);
      expect(result).toEqual(mockKategori);
    });

    it("should throw an error if kategori not found", async () => {
      Kategori.findById.mockResolvedValue(null);
      await expect(kategoriService.getKategoriById(1)).rejects.toThrow(
        "Kategori tidak ditemukan"
      );
    });
  });

  describe("addKategori", () => {
    it("should create a new kategori", async () => {
      const mockKategaoriData = {
        nama_kategori: "Makanan",
      };

      const mockNewKategori = {
        kategoriID: 1,
        ...mockKategaoriData,
      };

      Kategori.create.mockResolvedValue(mockNewKategori);

      const result = await kategoriService.addKategori(mockKategaoriData);
      expect(result).toEqual(mockNewKategori);
      // expect(Kategori.create).toHaveBeenCalledWith(mockKategaoriData);
    });

    it("should throw an error if validation fails", async () => {
      const mockKategaoriData = {
        nama_kategori: "",
      };

      await expect(
        kategoriService.addKategori(mockKategaoriData)
      ).rejects.toThrow(Joi.ValidationError);
    });
  });

  describe("updateKategori", () => {
    it("should update a petani", async () => {
      const mockUpdateData = {
        nama_kategori: "Minuman",
      };

      const mockUpdateKategori = {
        kategoriID: 1,
        ...mockUpdateData,
      };

      Kategori.update.mockResolvedValue(mockUpdateData);

      const result = await kategoriService.updateKategori(1, mockUpdateData);
      expect(result).toEqual(mockUpdateKategori);
    });

    it("should throw a Joi ValidationError if validation fails", async () => {
      const mockUpdateData = {
        nama_kategori: "",
      };
      try {
        await kategoriService.updateKategori(1, mockUpdateData);
        fail("Expected Joi ValidationError to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(Joi.ValidationError);
        expect(error.message).toMatch(
          /"nama_kategori" is not allowed to be empty/
        );
      }
    });
  });

  describe("deleteKategori", () => {
    it("should delete a kategori", async () => {
      Kategori.delete.mockResolvedValue();
      await expect(kategoriService.deleteKategori(1)).resolves.not.toThrow();
    });
  });
});
