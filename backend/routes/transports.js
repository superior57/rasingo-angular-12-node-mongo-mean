const express = require("express");
const TransportController = require("../controllers/transports");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

router.post("/addTransport", checkAuth, TransportController.createTransport);
router.get("", TransportController.getTransports);

module.exports = router;
