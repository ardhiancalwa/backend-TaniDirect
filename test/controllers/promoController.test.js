const request = require("supertest");
const express = require("express");
const promoController = require("../../src/controllers/promoController");
const promoService = require("../../src/services/promoService");
const bodyParser = require("body-parser");

jest.mock("../../src/services/promoService");

const app = express();
app.use(bodyParser.json());
app.get("/promo", promoController.getAllPromo);
app.post("/promo", promoController.addPromo);
app.get("/promo/:nama_promo", promoController.getPromoByName);
app.put("/promo/:nama_promo", promoController.updatePromo);
app.delete("/promo/:nama_promo", promoController.deletePromo);

describe("promoController", () => {
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
      promoService.getAllPromo.mockResolvedValue(mockPromo);

      const res = await request(app).get("/promo");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "success",
        message: "Data promo berhasil ditemukan",
        data: mockPromo,
      });
    });

    it("should return an error if no promos are found", async () => {
      promoService.getAllPromo.mockRejectedValue(
        new Error("Data tidak ditemukan")
      );

      const res = await request(app).get("/promo");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        status: "error",
        message: "Data tidak ditemukan",
      });
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
      promoService.getPromoByName.mockResolvedValue(mockPromo);

      const res = await request(app).get("/promo/Promo1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "success",
        message: "Promo berhasil ditemukan",
        data: mockPromo,
      });
    });

    it("should return an error if promo is not found", async () => {
      promoService.getPromoByName.mockRejectedValue(
        new Error("Promo tidak ditemukan")
      );

      const res = await request(app).get("/promo/Promo1");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        status: "error",
        message: "Promo tidak ditemukan",
      });
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

      promoService.addPromo.mockResolvedValue(mockNewPromo);

      const res = await request(app).post("/promo").send(mockPromoData);
      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        status: "success",
        message: "Promo berhasil ditambahkan",
        data: mockNewPromo,
      });
    });

    it("should return an error if adding promo fails", async () => {
      promoService.addPromo.mockRejectedValue(new Error("Validation error"));

      const res = await request(app).post("/promo").send({ nama_promo: "" });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        status: "error",
        message: "Validation error",
      });
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

      promoService.updatePromo.mockResolvedValue(mockUpdatedPromo);

      const res = await request(app).put("/promo/Promo1").send(mockUpdateData);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "success",
        message: "Promo berhasil diupdate",
        data: mockUpdatedPromo,
      });
    });

    it("should return an error if update fails", async () => {
      promoService.updatePromo.mockRejectedValue(new Error("Validation error"));

      const res = await request(app)
        .put("/promo/Promo1")
        .send({ deskripsi_promo: "" });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        status: "error",
        message: "Validation error",
      });
    });
  });

  describe("deletePromo", () => {
    it("should delete an existing promo", async () => {
      promoService.deletePromo.mockResolvedValue();

      const res = await request(app).delete("/promo/Promo1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "success",
        message: "Promo berhasil dihapus",
      });
    });

    it("should return an error if delete fails", async () => {
      promoService.deletePromo.mockRejectedValue(
        new Error("Promo gagal dihapus")
      );

      const res = await request(app).delete("/promo/Promo1");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        status: "error",
        message: "Promo gagal dihapus",
      });
    });
  });
});
