const Pembeli = require("../../src/models/pembeliModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pembeliService = require("../../src/services/pembeliService");
const Joi = require("joi");

jest.mock("../../src/models/pembeliModel");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword");
bcrypt.compare = jest.fn().mockResolvedValue(true);

describe("pembeliService", () => {
  describe("getAllPembeli", () => {
    it("should return all pembeli", async () => {
      const mockPembeli = [{ pembeliID: 1, nama_pembeli: "John Doe" }];
      Pembeli.findAll.mockResolvedValue(mockPembeli);

      const result = await pembeliService.getAllPembeli();
      expect(result).toEqual(mockPembeli);
    });

    it("should throw an error if no pembeli is found", async () => {
      Pembeli.findAll.mockResolvedValue([]);

      await expect(pembeliService.getAllPembeli()).rejects.toThrow(
        "Data tidak ditemukan"
      );
    });
  });

  describe("getPembeliById", () => {
    it("should return a pembeli by ID", async () => {
      const mockPembeli = { pembeliID: 1, nama_pembeli: "John Doe" };
      Pembeli.findById.mockResolvedValue(mockPembeli);

      const result = await pembeliService.getPembeliById(1);
      expect(result).toEqual(mockPembeli);
    });
    it("should throw an error if pembeli not found", async () => {
      Pembeli.findById.mockResolvedValue(null);

      await expect(pembeliService.getPembeliById(1)).rejects.toThrow(
        "Pembeli tidak ditemukan"
      );
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

      Pembeli.create.mockResolvedValue(mockNewPembeli);
      bcrypt.hash.mockResolvedValue("hashedPassword");

      const result = await pembeliService.registerPembeli(mockPembeliData);
      expect(result).toEqual(mockNewPembeli);
      expect(bcrypt.hash).toHaveBeenCalledWith(
        mockPembeliData.password_pembeli,
        10
      );
    });

    it("should throw an error if validation fails", async () => {
      const mockPembeliData = {
        nama_pembeli: "",
        alamat_pembeli: "123 Street",
        kontak_pembeli: "1234567890",
        email_pembeli: "john@example.com",
        password_pembeli: "password123",
      };

      await expect(
        pembeliService.registerPembeli(mockPembeliData)
      ).rejects.toThrow(Joi.ValidationError);
    });
  });

  describe("loginPembeli", () => {
    it("should return a token if login is successful", async () => {
      const mockLoginData = {
        email_pembeli: "john@example.com",
        password_pembeli: "password123",
      };

      const mockPembeli = {
        pembeliID: 1,
        ...mockLoginData,
        password_pembeli: "hashedPassword",
      };

      Pembeli.findByEmail.mockReturnValue(mockPembeli);
      bcrypt.compare.mockReturnValue(true);
      jwt.sign.mockReturnValue("token");

      const result = await pembeliService.loginPembeli(mockLoginData);
      expect(result).toEqual("token");
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockPembeli.pembeliID },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
    });

    it("should throw an error if email or password is incorrect", async () => {
      const mockLoginData = {
        email_pembeli: "john@example.com",
        password_pembeli: "password123",
      };
      Pembeli.findByEmail.mockResolvedValue(null);

      await expect(pembeliService.loginPembeli(mockLoginData)).rejects.toThrow(
        "Email atau password salah"
      );
    });
  });

  describe("updatePembeli", () => {
    it("should update a pembeli", async () => {
      const mockUpdateData = {
        nama_pembeli: "Jane Doe",
      };

      const mockUpdatedPembeli = {
        pembeliID: 1,
        ...mockUpdateData,
      };

      Pembeli.update.mockResolvedValue(mockUpdatedPembeli);
      
      const result = await pembeliService.updatePembeli(1, mockUpdateData);
      expect(result).toEqual(mockUpdatedPembeli);
    });

    it("should throw a Joi ValidationError if validation fails", async () => {
      const mockUpdateData = {
        nama_pembeli: "",
      };
      try {
        await pembeliService.updatePembeli(1, mockUpdateData);
        // Jika tidak melempar error, maka tes gagal
        fail("Expected Joi ValidationError to be thrown");
      } catch (error) {
        // Memastikan error yang dilempar adalah Joi.ValidationError
        expect(error).toBeInstanceOf(Joi.ValidationError);
        // Memastikan pesan error sesuai dengan yang diharapkan
        expect(error.mesage).toMatch(
          /"nama_pembeli" is not allowed to be empty/
        );
      }
    });
  });
  describe("delete", () => {
    it("should delete a pembeli", async () => {
      Pembeli.delete.mockResolvedValue();
      await expect(pembeliService.deletePembeli(1)).resolves.not.toThrow();
    });
  });
});
