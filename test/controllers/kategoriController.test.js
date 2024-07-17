const request = require("supertest");
const express = require("express");
const kategoriController = require("../../src/controllers/kategoriController");
const kategoriService = require("../../src/services/kategoriService");
const bodyParser = require("body-parser");

jest.mock("../../src/services/kategoriService");

const app = express();
app.use(bodyParser.json());
app.get("/kategori", kategoriController.getAllKategori);
app.get("/kategori/:kategoriID", kategoriController.getKategoriById);
app.post("/kategori", kategoriController.addKategori);
app.put("/kategori/:kategoriID", kategoriController.updateKategori);
app.delete("/kategori/:kategoriID", kategoriController.deleteKategori);

describe("kategeoriController", () => {
  describe("getAllKategori", () => {
    it("should return all kategori", async () => {
      const mockKategori = [{ kategoriID: 1, nama_kategori: "Makanan" }];
      kategoriService.getAllKategori.mockResolvedValue(mockKategori);

      const res = await request(app).get("/kategori");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "success",
        message: "Data kategori berhasil ditemukan",
        data: mockKategori,
      });
    });

    it("should return an error if no kategori is found", async () => {
      kategoriService.getAllKategori.mockRejectedValue(
        new Error("Data tidak ditemukan")
      );

      const res = await request(app).get("/kategori");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        status: "error",
        message: "Data tidak ditemukan",
      });
    });
  });

  describe("getKategoriById", () => {
    it("should return kategori by ID", async () => {
      const mockKategori = { kategoriID: 1, nama_kategori: "Makanan" };
      kategoriService.getKategoriById.mockResolvedValue(mockKategori);

      const res = await request(app).get("/kategori/1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "success",
        message: "Kategori berhasil ditemukan",
        data: mockKategori,
      });
    });

    it("should return an error if kategori not found", async () => {
      kategoriService.getKategoriById.mockRejectedValue(
        new Error("Kategori tidak ditemukan")
      );

      const res = await request(app).get("/kategori/1");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        status: "error",
        message: "Kategori tidak ditemukan",
      });
    });
  });

  describe("addKategori", () => {
    it("should register a new kategori", async () => {
      const mockKategoriData = {
        nama_kategori: "Makanan",
      };

      const mockNewKategori = {
        kategoriID: 1,
        ...mockKategoriData,
      };

      kategoriService.addKategori.mockResolvedValue(mockNewKategori);

      const res = await request(app).post("/kategori").send(mockKategoriData);
      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        status: "success",
        message: "Kategori berhasil ditambahkan",
        data: mockNewKategori,
      });
    });

    it("should return an error if add kategori fails", async () => {
      kategoriService.addKategori.mockRejectedValue(
        new Error("Validation error")
      );

      const res = await request(app)
        .post("/kategori")
        .send({ nama_kategori: "" });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        status: "error",
        message: "Validation error",
      });
    });
  });

  describe("updateKategori", () => {
    it("should update a kategori", async () => {
      const mockUpdateData = {
        nama_kategori: "Minuman",
      };

      const mockUpdatedKategori = {
        kategoriID: 1,
        ...mockUpdateData,
      };

      kategoriService.updateKategori.mockResolvedValue(mockUpdatedKategori);

      const res = await request(app).put("/kategori/1").send(mockUpdateData);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "success",
        message: "Kategori berhasil diubah",
        data: mockUpdatedKategori,
      });
    });

    it("should return an error if update fails", async () => {
      kategoriService.updateKategori.mockRejectedValue(
        new Error("Validation error")
      );

      const res = await request(app)
        .put("/kategori/1")
        .send({ nama_kategori: "" });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        status: "error",
        message: "Validation error",
      });
    });
  });

  describe("deleteKategori", () => {
    it("should delete a kategori", async () => {
      kategoriService.deleteKategori.mockResolvedValue();

      const res = await request(app).delete("/kategori/1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "success",
        message: "Kategori berhasil dihapus",
      });
    });

    it("should return an error if delete fails", async () => {
      kategoriService.deleteKategori.mockRejectedValue(
        new Error("Kategori gagal dihapus")
      );

      const res = await request(app).delete("/kategori/1");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        status: "error",
        message: "Kategori gagal dihapus",
      });
    });
  });
});
