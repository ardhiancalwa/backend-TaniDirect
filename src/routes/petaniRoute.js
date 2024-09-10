// routes/petaniRoutes.js
const express = require("express");
const router = express.Router();
const petaniController = require("../controllers/petaniController");
const { registerPetani } = require("../controllers/petaniController");
const { authenticatePetani } = require("../middlewares/roleAuth");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user",
    // format: async (req, file) => 'jpg', // mendukung penggunaan promise
    public_id: (req, file) =>
      Date.now() + "-" + Math.round(Math.random() * 1e9),
  },
});

const upload = multer({ storage: storage });

router.post(
  "/register",
  upload.single("image_petani"),
  async (req, res, next) => {
    try {
      req.body.image_petani = req.file ? req.file.path : null;
      await registerPetani(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);
router.post("/login", petaniController.loginPetani);

router.get(
  "/",
  authenticatePetani,
  petaniController.getAllPetani
);
router.get("/:petaniID", authenticatePetani, petaniController.getPetaniById);

router.put(
  "/:petaniID",
  authenticatePetani,
  upload.single("image_petani"),
  petaniController.updatePetani
);
router.delete("/:petaniID", authenticatePetani, petaniController.deletePetani);

module.exports = router;
