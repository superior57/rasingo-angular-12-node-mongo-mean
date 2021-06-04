const express = require("express");

const UserController = require("../controllers/user");
const extractDocsFile = require("../middleware/docsfile");
const extractTruckFiles = require("../middleware/truckfiles");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

/*App*/
router.post("/signup", UserController.createUser);
router.put("/signupStep1", checkAuth, UserController.createUserStep1);
router.put("/signupStep2", checkAuth, UserController.createUserStep2);
router.post("/login", UserController.userLogin);
router.get("/confirmation", UserController.confirmationPost);
router.get("/getUserData/:id", UserController.getUserData);
router.post("/docs", checkAuth, extractDocsFile, UserController.createDocs);
router.put("/truckDocs", checkAuth, extractTruckFiles, UserController.createTruckDocs);
router.post("/resendAC", checkAuth, UserController.resendAC);
router.post("/sendPhoneCode", checkAuth, UserController.sendPhoneCode);
router.post("/verifyPhoneCode", checkAuth, UserController.verifyPhoneCode);
router.post("/invite", checkAuth, UserController.inviteUser);
router.put("/editPassword", checkAuth, UserController.editPassword);
router.post("/sendForgotCode", UserController.sendForgotCode);
router.put("/changeFPassword", UserController.changeForgottenPassword);
router.post("/addNewsletterEmail", UserController.addNewsletterEmail);
router.post("/contact", UserController.contact);

/*Admin*/
router.get("/getUsers", UserController.getUsers);
router.get("/download/:name", UserController.downloadFile);
router.put("/approve/:id", UserController.approve);

module.exports = router;
