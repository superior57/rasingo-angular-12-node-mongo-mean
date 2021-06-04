const express = require("express");

const CargoController = require("../controllers/cargos");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/imagefile");

const router = express.Router();

router.post("/addCargo", checkAuth, CargoController.createCargo);
router.put("/:id", checkAuth, extractFile, CargoController.updateCargo);
router.get("/getCargos", CargoController.getCargos);
router.get("/getMyCargos", CargoController.getMyCargos);
router.get("/getCargosAndLoadsUnloads/:id", CargoController.getCargoAndLoadsUnloads);
router.get("/getCargosByUserId", checkAuth, CargoController.getCargosByUserId);
router.delete("/:id", checkAuth, CargoController.deleteCargo);
router.put("/chooseTransporter/:signupId", checkAuth, CargoController.chooseTransporter);
router.get("/getCargosForProfile/:userId", CargoController.getCargosForProfile);
router.post("/addCMR", checkAuth, CargoController.addCMR);
router.get("/getCMRById/:cmrId", CargoController.getCMRById);

module.exports = router;
