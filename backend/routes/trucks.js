const express = require("express");
const TrucksController = require("../controllers/trucks");
const checkAuth = require("../middleware/check-auth");
const extractDocsFile = require("../middleware/docsfile");
const router = express.Router();

router.get("/getTrucksByUserId/:id", checkAuth, TrucksController.getTrucksByUserId);
router.delete("/deleteTruck/:id", checkAuth, TrucksController.deleteTruck);
router.post("/addNewTrucks", checkAuth, TrucksController.addNewTrucks);
router.get("/download/:name", TrucksController.downloadFile);

/*Admin*/
router.put("/approve/:id", TrucksController.approve);
module.exports = router;
