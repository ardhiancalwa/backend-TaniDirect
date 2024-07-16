const Petani = require('../../src/models/petaniModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const petaniService = require('../../src/services/petaniService');
const Joi = require('joi');

jest.mock('../../src/models/petaniModel');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
bcrypt.compare = jest.fn().mockResolvedValue(true);

describe('petaniService', () => {
  describe('getAllPetani', () => {
    it('should return all petani', async () => {
      const mockPetani = [{ petaniID: 1, nama_petani: 'John Doe' }];
      Petani.findAll.mockResolvedValue(mockPetani);
      
      const result = await petaniService.getAllPetani();
      expect(result).toEqual(mockPetani);
    });

    it('should throw an error if no petani found', async () => {
      Petani.findAll.mockResolvedValue([]);
      
      await expect(petaniService.getAllPetani()).rejects.toThrow('Data tidak ditemukan');
    });
  });

  describe('getPetaniById', () => {
    it('should return petani by ID', async () => {
      const mockPetani = { petaniID: 1, nama_petani: 'John Doe' };
      Petani.findById.mockResolvedValue(mockPetani);
      
      const result = await petaniService.getPetaniById(1);
      expect(result).toEqual(mockPetani);
    });

    it('should throw an error if petani not found', async () => {
      Petani.findById.mockResolvedValue(null);
      
      await expect(petaniService.getPetaniById(1)).rejects.toThrow('Petani tidak ditemukan');
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

      Petani.create.mockResolvedValue(mockNewPetani);
      bcrypt.hash.mockResolvedValue('hashedpassword');

      const result = await petaniService.registerPetani(mockPetaniData);
      expect(result).toEqual(mockNewPetani);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPetaniData.password_petani, 10);
    });

    it('should throw an error if validation fails', async () => {
      const mockPetaniData = {
        nama_petani: '',
        alamat_petani: '123 Street',
        no_telepon_petani: '1234567890',
        email_petani: 'john@example.com',
        password_petani: 'password123',
      };

      await expect(petaniService.registerPetani(mockPetaniData)).rejects.toThrow(Joi.ValidationError);
    });
  });

  describe('loginPetani', () => {
    it('should return a token if login is successful', async () => {
      const mockLoginData = {
        email_petani: 'john@example.com',
        password_petani: 'password123',
      };

      const mockPetani = {
        petaniID: 1,
        ...mockLoginData,
        password_petani: 'hashedpassword',
      };

      Petani.findByEmail.mockResolvedValue(mockPetani);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token');

      const result = await petaniService.loginPetani(mockLoginData);
      expect(result).toEqual('token');
      expect(jwt.sign).toHaveBeenCalledWith({ id: mockPetani.petaniID }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    it('should throw an error if email or password is incorrect', async () => {
      const mockLoginData = {
        email_petani: 'john@example.com',
        password_petani: 'password123',
      };

      Petani.findByEmail.mockResolvedValue(null);

      await expect(petaniService.loginPetani(mockLoginData)).rejects.toThrow('Email atau password salah');
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

      Petani.update.mockResolvedValue(mockUpdatedPetani);

      const result = await petaniService.updatePetani(1, mockUpdateData);
      expect(result).toEqual(mockUpdatedPetani);
    });

    it('should throw a Joi ValidationError if validation fails', async () => {
      const mockUpdateData = {
        nama_petani: '',
      };
    
      try {
        await petaniService.updatePetani(1, mockUpdateData);
        // Jika tidak melempar error, maka tes gagal
        fail('Expected Joi ValidationError to be thrown');
      } catch (error) {
        // Memastikan error yang dilempar adalah Joi.ValidationError
        expect(error).toBeInstanceOf(Joi.ValidationError);
        // Memastikan pesan error sesuai dengan yang diharapkan
        expect(error.message).toMatch(/"nama_petani" is not allowed to be empty/);
      }
    });    
  });

  describe('deletePetani', () => {
    it('should delete a petani', async () => {
      Petani.delete.mockResolvedValue();

      await expect(petaniService.deletePetani(1)).resolves.not.toThrow();
    });
  });  
});
