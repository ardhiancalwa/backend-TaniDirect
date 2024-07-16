const request = require("supertest");
const express = require("express");
const pembeliController = require("../../src/controllers/pembeliController");
const pembeliService = require("../../src/services/pembeliService");
const bodyParser = require("body-parser");

jest.mock("../../src/services/pembeliService");

const app = express();
app.use(bodyParser.json());
app.get("/pembeli", pembeliController.getAllPembeli);
app.get("/pembeli/:petaniID", pembeliController.getPembeliById);
app.post("/pembeli/register", pembeliController.registerPembeli);
app.post("/pembeli/login", pembeliController.loginPembeli);
app.put("/pembeli/:pembeliID", pembeliController.updatePembeli);
app.delete("/pembeli/:pembeliID", pembeliController.deletePembeli);

describe("pembeliController", () => {
  describe("getAllPembeli", () => {
    it("should return all pembeli", async () => {
      const mockPembeli = [{ pembeliID: 1, nama_pembeli: "John Doe" }];
      pembeliService.getAllPembeli.mockResolvedValue(mockPembeli);

      const res = await request(app).get("/pembeli");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "success",
        message: "Data pembeli berhasil ditemukan",
        data: mockPembeli,
      });
    });

    it("should return an error if no pembeli found", async () => {
      pembeliService.getAllPembeli.mockRejectedValue(
        new Error("Data pembeli tidak ditemukan")
      );

      const res = await request(app).get("/pembeli");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        status: "error",
        message: "Data pembeli tidak ditemukan",
      });
    });
  });

  describe("getPembeliById", () => {
    it("should return a single Pembeli by ID", async () => {
      const mockPembeli = { pembeliID: 1, nama_pembeli: "John Doe" };
      pembeliService.getPembeliById.mockResolvedValue(mockPembeli);

      const res = await request(app).get("/pembeli/1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "success",
        message: "Data pembeli berhasil ditemukan",
        data: mockPembeli,
      });
    });

    it("should return an error if Pembeli not found", async () => {
      pembeliService.getPembeliById.mockResolvedValue(
        new Error("Pembeli tidak ditemukan")
      );

      const res = await request(app).get("/pembeli/1");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        status: "error",
        message: "Pembeli tidak ditemukan",
      });
    });
  });

  describe("registerPembeli", () => {
    it("should register a new pembeli", async () => {
      const mockPembeliData = {
        nama_pembeli: "John Doe",
        alamat_pembeli: "123 Street",
        kontak_pembeli: "1234567890",
        email_pembeli: "john@example.com",
        password_pembeli: "password123",
      };

      const mockNewPembeli = {
        pembeliID: 1,
        ...mockPembeliData,
      };

      pembeliService.registerPembeli.mockResolvedValue(mockNewPembeli);

      const res = await request(app)
        .post("/pembeli/register")
        .send(mockPembeliData);
      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        status: "success",
        message: "Pembeli berhasil didaftarkan",
        data: mockNewPembeli,
      });
    });

    it("should return an error if registration fails", async () => {
      pembeliService.registerPembeli.mockRejectedValue(
        new Error("Validation error")
      );

      const res = await request(app).post("/pembeli/register").send({
        nama_pembeli: "",
        alamat_petani: "123 Street",
        no_telepon_petani: "1234567890",
        email_petani: "john@example.com",
        password_petani: "password123",
      });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        status: "error",
        message: "Validation error",
      });
    });
  });

  describe("loginPembeli", () => {
    it("should return a token if login is successful", async () => {
      const mockLoginData = {
        email_pembeli: "john@example.com",
        password_pembeli: "password123",
      };

      const mockToken = "token";
      pembeliService.loginPembeli.mockResolvedValue(mockToken);

      const res = await request(app).post("/pembeli/login").send(mockLoginData);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "success",
        message: "Login berhasil",
        data: { token: mockToken },
      });
    });

    it("should return an error if login fails", async () => {
      pembeliService.loginPembeli.mockRejectedValue(
        new Error("Email atau password salah")
      );

      const res = await request(app).post("/pembeli/login").send({
        email_pembeli: "john@example.com",
        password_pembeli: "password123",
      });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        status: "error",
        message: "Email atau password salah",
      });
    });
  });

  describe("updaePembeli", () => {
    it("should update a pembeli", async () => {
      const mockUpdateData = {
        nama_pembeli: "Jane Doe",
      };
      const mockUpdatedPembeli = {
        pembeliID: 1,
        ...mockUpdateData,
      };

      pembeliService.updatePembeli.mockResolvedValue(mockUpdatedPembeli);

      const res = await request(app).put("/pembeli/1").send(mockUpdateData);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "success",
        message: "Pembeli berhasil diupdate",
        data: mockUpdatedPembeli,
      });
    });

    it("should return an error if update fails", async () => {
      pembeliService.updatePembeli.mockRejectedValue(
        new Error("Validation error")
      );

      const res = await request(app).put("/pembeli/1").send({
        nama_pembeli: "",
      });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        status: "error",
        message: "Validation error",
      });
    });
  });

  describe("deletePembeli", () => {
    it("should delete a pembeli", async () => {
      pembeliService.deletePembeli.mockResolvedValue();

      const res = await request(app).delete("/pembeli/1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: "success",
        message: "Pembeli berhasil dihapus",
      });
    });

    it("should return an error if delete fails", async () => {
      pembeliService.deletePembeli.mockRejectedValue(
        new Error("Pembeli gagal dihapus")
      );

      const res = await request(app).delete("/pembeli/1");
      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        status: "error",
        message: "Pembeli gagal dihapus",
      });
    });
  });
});
