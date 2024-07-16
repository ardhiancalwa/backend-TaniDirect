const request = require('supertest');
const express = require('express');
const petaniController = require('../../src/controllers/petaniController');
const petaniService = require('../../src/services/petaniService');
const bodyParser = require('body-parser');

jest.mock('../../src/services/petaniService');

const app = express();
app.use(bodyParser.json());
app.get('/petani', petaniController.getAllPetani);
app.get('/petani/:petaniID', petaniController.getPetaniById);
app.post('/petani/register', petaniController.registerPetani);
app.post('/petani/login', petaniController.loginPetani);
app.put('/petani/:petaniID', petaniController.updatePetani);
app.delete('/petani/:petaniID', petaniController.deletePetani);

describe('petaniController', () => {
  describe('getAllPetani', () => {
    it('should return all petani', async () => {
      const mockPetani = [{ petaniID: 1, nama_petani: 'John Doe' }];
      petaniService.getAllPetani.mockResolvedValue(mockPetani);

      const res = await request(app).get('/petani');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'success',
        message: 'Data petani berhasil ditemukan',
        data: mockPetani,
      });
    });

    it('should return an error if no petani found', async () => {
      petaniService.getAllPetani.mockRejectedValue(new Error('Data tidak ditemukan'));

      const res = await request(app).get('/petani');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        status: 'error',
        message: 'Data tidak ditemukan',
      });
    });
  });

  describe('getPetaniById', () => {
    it('should return petani by ID', async () => {
      const mockPetani = { petaniID: 1, nama_petani: 'John Doe' };
      petaniService.getPetaniById.mockResolvedValue(mockPetani);

      const res = await request(app).get('/petani/1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'success',
        message: 'Data petani berhasil ditemukan',
        data: mockPetani,
      });
    });

    it('should return an error if petani not found', async () => {
      petaniService.getPetaniById.mockRejectedValue(new Error('Petani tidak ditemukan'));

      const res = await request(app).get('/petani/1');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        status: 'error',
        message: 'Petani tidak ditemukan',
      });
    });
  });

  describe('registerPetani', () => {
    it('should register a new petani', async () => {
      const mockPetaniData = {
        nama_petani: 'John Doe',
        alamat_petani: '123 Street',
        no_telepon_petani: '1234567890',
        email_petani: 'john@example.com',
        password_petani: 'password123',
      };
      
      const mockNewPetani = {
        petaniID: 1,
        ...mockPetaniData,
      };

      petaniService.registerPetani.mockResolvedValue(mockNewPetani);

      const res = await request(app).post('/petani/register').send(mockPetaniData);
      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        status: 'success',
        message: 'Petani berhasil didaftarkan',
        data: mockNewPetani,
      });
    });

    it('should return an error if registration fails', async () => {
      petaniService.registerPetani.mockRejectedValue(new Error('Validation error'));

      const res = await request(app).post('/petani/register').send({
        nama_petani: '',
        alamat_petani: '123 Street',
        no_telepon_petani: '1234567890',
        email_petani: 'john@example.com',
        password_petani: 'password123',
      });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        status: 'error',
        message: 'Validation error',
      });
    });
  });

  describe('loginPetani', () => {
    it('should return a token if login is successful', async () => {
      const mockLoginData = {
        email_petani: 'john@example.com',
        password_petani: 'password123',
      };

      const mockToken = 'token';
      petaniService.loginPetani.mockResolvedValue(mockToken);

      const res = await request(app).post('/petani/login').send(mockLoginData);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'success',
        message: 'Login berhasil',
        data: { token: mockToken },
      });
    });

    it('should return an error if login fails', async () => {
      petaniService.loginPetani.mockRejectedValue(new Error('Email atau password salah'));

      const res = await request(app).post('/petani/login').send({
        email_petani: 'john@example.com',
        password_petani: 'password123',
      });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        status: 'error',
        message: 'Email atau password salah',
      });
    });
  });

  describe('updatePetani', () => {
    it('should update a petani', async () => {
      const mockUpdateData = {
        nama_petani: 'Jane Doe',
      };

      const mockUpdatedPetani = {
        petaniID: 1,
        ...mockUpdateData,
      };

      petaniService.updatePetani.mockResolvedValue(mockUpdatedPetani);

      const res = await request(app).put('/petani/1').send(mockUpdateData);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'success',
        message: 'Petani berhasil diupdate',
        data: mockUpdatedPetani,
      });
    });

    it('should return an error if update fails', async () => {
      petaniService.updatePetani.mockRejectedValue(new Error('Validation error'));

      const res = await request(app).put('/petani/1').send({
        nama_petani: '',
      });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        status: 'error',
        message: 'Validation error',
      });
    });
  });

  describe('deletePetani', () => {
    it('should delete a petani', async () => {
      petaniService.deletePetani.mockResolvedValue();

      const res = await request(app).delete('/petani/1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'success',
        message: 'Petani berhasil dihapus',
      });
    });

    it('should return an error if delete fails', async () => {
      petaniService.deletePetani.mockRejectedValue(new Error('Petani tidak ditemukan'));

      const res = await request(app).delete('/petani/1');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        status: 'error',
        message: 'Petani tidak ditemukan',
      });
    });
  });
});
