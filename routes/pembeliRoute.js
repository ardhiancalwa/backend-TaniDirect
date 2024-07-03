const express = require("express");
const router = express.Router();
const pembeliController = require("../controllers/pembeliController");
const passport = require("../middlewares/auth");

router.post("/pembeli/register", pembeliController.registerPembeli);
router.post("/pembeli/login", pembeliController.loginPembeli);

router.get(
  "/pembeli",
  passport.authenticate("jwt-pembeli", { session: false }),
  pembeliController.getAllPembeli
);
router.get(
  "/pembeli/:pembeliID",
  passport.authenticate("jwt-pembeli", { session: false }),
  pembeliController.getPembeliById
);
router.put(
  "/pembeli/:pembeliID",
  passport.authenticate("jwt-pembeli", { session: false }),
  pembeliController.updatePembeli
);
router.delete(
  "/pembeli/:pembeliID",
  passport.authenticate("jwt-pembeli", { session: false }),
  pembeliController.deletePembeli
);

module.exports = router;
