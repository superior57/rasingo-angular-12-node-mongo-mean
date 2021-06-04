const express = require("express");
const SignupsController = require("../controllers/signups");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

router.post("/addSignup", checkAuth, SignupsController.createSignup);
router.get("/getSignupsByUserId/:id", checkAuth, SignupsController.getSignupsByUserId);
router.get("/getSignupById/:id", SignupsController.getSignupById);

module.exports = router;
