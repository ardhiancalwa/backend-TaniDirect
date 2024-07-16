const petaniService = require('../services/petaniService');

const getAllPetani = async (req, res, next) => {
  try {
    const petani = await petaniService.getAllPetani();
    res.status(200).json({
      status: 'success',
      message: 'Data petani berhasil ditemukan',
      data: petani,
    });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

const getPetaniById = async (req, res, next) => {
  const { petaniID } = req.params;

  try {
    const petani = await petaniService.getPetaniById(petaniID);
    res.status(200).json({
      status: 'success',
      message: 'Data petani berhasil ditemukan',
      data: petani,
    });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

const registerPetani = async (req, res, next) => {
  try {
    const newPetani = await petaniService.registerPetani(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Petani berhasil didaftarkan',
      data: newPetani,
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

const loginPetani = async (req, res, next) => {
  try {
    const token = await petaniService.loginPetani(req.body);
    res.status(200).json({
      status: 'success',
      message: 'Login berhasil',
      data: { token },
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

const updatePetani = async (req, res, next) => {
  const { petaniID } = req.params;

  try {
    const updatedPetani = await petaniService.updatePetani(petaniID, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Petani berhasil diupdate',
      data: updatedPetani,
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

const deletePetani = async (req, res, next) => {
  const { petaniID } = req.params;

  try {
    await petaniService.deletePetani(petaniID);
    res.status(200).json({
      status: 'success',
      message: 'Petani berhasil dihapus',
    });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  getAllPetani,
  getPetaniById,
  registerPetani,
  loginPetani,
  updatePetani,
  deletePetani,
};
