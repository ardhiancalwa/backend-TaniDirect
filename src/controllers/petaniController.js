const PetaniService = require('../services/petaniService');

const getAllPetani = async (req, res, next) => {
  try {
    const petani = await PetaniService.getAllPetani();
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
    const petani = await PetaniService.getPetaniById(petaniID);
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
    const {token, newPetani} = await PetaniService.registerPetani(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Petani berhasil didaftarkan',
      data: {token, newPetani},
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

const loginPetani = async (req, res, next) => {
  try {
    const { token, id } = await PetaniService.loginPetani(req.body);
    res.status(200).json({
      status: 'success',
      message: 'Login berhasil',
      data: { token, petaniID: id },
    });
  } catch (error) {
    next(error);
  }
};

const updatePetani = async (req, res, next) => {
  const { petaniID } = req.params;

  try {
    const updatedPetani = await PetaniService.updatePetani(petaniID, req.body);
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
    await PetaniService.deletePetani(petaniID);
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
