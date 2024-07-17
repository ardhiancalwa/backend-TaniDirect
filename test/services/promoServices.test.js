const Promo = require("../../src/models/promoModel");
const promoService = require("../../src/services/promoService");
const Joi = require("joi");

jest.mock("../../src/models/promoModel");

describe("promoService", () => {
  describe("getAllPromo", () => {
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
      Promo.findAll.mockResolvedValue(mockPromo);

      const result = await promoService.getAllPromo();
      expect(result).toEqual(mockPromo);
    });

    it("should throw an error if no promo are found", async () => {
      Promo.findAll.mockResolvedValue([]);
      await expect(promoService.getAllPromo()).rejects.toThrow(
        "Data promo tidak ditemukan"
      );
    });
  });

  describe("getPromoByName", () => {
    it("should return a promo by name", async () => {
      const mockPromo = {
        nama_promo: "Promo1",
        deskripsi_promo: "Deskripsi1",
        tanggal_dimulai: new Date(),
        tanggal_berakhir: new Date(),
      };
      Promo.findByName.mockResolvedValue(mockPromo);

      const result = await promoService.getPromoByName("Promo1");
      expect(result).toEqual(mockPromo);
    });

    it("should throw an error if promo is not found", async () => {
      Promo.findByName.mockResolvedValue(null);

      await expect(promoService.getPromoByName("Promo1")).rejects.toThrow(
        "Promo tidak ditemukan"
      );
    });
  });

  describe("addPromo", () => {
    it("should create a new promo", async () => {
      const mockPromoData = {
        nama_promo: "Promo1",
        deskripsi_promo: "Deskripsi1",
        tanggal_dimulai: "2024-01-01T00:00:00.000Z",
        tanggal_berakhir: "2024-12-31T23:59:59.999Z",
      };

      const mockNewPromo = {
        ...mockPromoData,
        tanggal_dimulai: new Date(mockPromoData.tanggal_dimulai),
        tanggal_berakhir: new Date(mockPromoData.tanggal_berakhir),
      };

      Promo.create.mockResolvedValue(mockNewPromo);

      const result = await promoService.addPromo(mockPromoData);
      expect(result).toEqual(mockNewPromo);
    });
  });

  describe("updatePromo", () => {
    it("should update an existing promo", async () => {
      const mockUpdateData = {
        deskripsi_promo: "Updated Deskripsi",
        tanggal_dimulai: "2024-01-01T00:00:00.000Z",
        tanggal_berakhir: "2024-12-31T23:59:59.999Z",
      };

      const mockUpdatedPromo = {
        nama_promo: "Promo1",
        deskripsi_promo: "Updated Deskripsi",
        tanggal_dimulai: new Date(mockUpdateData.tanggal_dimulai),
        tanggal_berakhir: new Date(mockUpdateData.tanggal_berakhir),
      };

      Promo.update.mockResolvedValue(mockUpdateData);

      const result = await promoService.updatePromo(
        "Promo1",
        mockUpdateData
      );
      expect(result).toEqual(mockUpdatedPromo);
    });
  });

  describe('deletePromo', () => {
    it('should delete an existing promo', async () => {
      Promo.delete.mockResolvedValue();
      await promoService.deletePromo('Promo1').resolves.not.toThrow();
    });
  });
});
