const express = require("express");
const ProfileController = require("../controllers/profile");
const checkAuth = require("../middleware/check-auth");
const extractImageFile = require("../middleware/imagefile");
const router = express.Router();

router.post("/addProfile", checkAuth, ProfileController.createProfile);
router.put("/addCoverPhoto", extractImageFile, checkAuth, ProfileController.createCoverPhoto);
router.put("/addProfilePhoto", extractImageFile, checkAuth, ProfileController.createProfilePhoto);
router.get("/getUserProfile", checkAuth, ProfileController.getUserProfile);
router.get("/getPublicUserProfile/:userId", checkAuth, ProfileController.getPublicUserProfile);
router.get("/getProfileInfoById", checkAuth, ProfileController.getProfileInfoById);
router.put("/updateInfo", checkAuth, ProfileController.updateInfo);
router.post("/addReview", checkAuth, ProfileController.addReview);
router.get("/getReviewsByChildId/:childId", checkAuth, ProfileController.getReviewsByChildId);


module.exports = router;
