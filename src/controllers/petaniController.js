const PetaniService = require("../services/petaniService");

const getAllPetani = async (req, res, next) => {
  try {
    const petani = await PetaniService.getAllPetani();
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Farmer successfully found",
      data: petani,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        status: "error",
        statusCode: error.statusCode,
        message: error.message,
      });
    } else {
      next(error);
    }
  }
};

const getPetaniById = async (req, res, next) => {
  const { petaniID } = req.params;

  try {
    const petani = await PetaniService.getPetaniById(petaniID);
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "User successfully found",
      data: petani,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        status: "error",
        statusCode: error.statusCode,
        message: error.message,
      });
    } else {
      next(error);
    }
  }
};

const registerPetani = async (req, res, next) => {
  try {
    const { token, newPetani } = await PetaniService.registerPetani(req.body);
    res.status(201).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Farmer successfully registered",
      data: { token, newPetani },
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        status: "error",
        statusCode: error.statusCode,
        message: error.message,
      });
    } else {
      next(error);
    }
  }
};

const loginPetani = async (req, res, next) => {
  try {
    const { token, id } = await PetaniService.loginPetani(req.body);
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Login successful",
      data: { token, petaniID: id },
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        status: "error",
        statusCode: error.statusCode,
        message: error.message,
      });
    } else {
      next(error);
    }
  }
};

const updatePetani = async (req, res, next) => {
  const { petaniID } = req.params;

  try {
    const updatedPetani = await PetaniService.updatePetani(petaniID, req.body);
    res.status(200).json({
      status: "success",
      statusCode: res.statusCode,
      message: "Successfully updated",
      data: updatedPetani,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        status: "error",
        statusCode: error.statusCode,
        message: error.message,
      });
    } else {
      next(error);
    }
  }
};

const deletePetani = async (req, res, next) => {
  const { petaniID } = req.params;

  try {
    await PetaniService.deletePetani(petaniID);
    res.status(200).json({
      status: "success",
      message: "Farmer successfully deleted",
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        status: "error",
        statusCode: error.statusCode,
        message: error.message,
      });
    } else {
      next(error);
    }
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
