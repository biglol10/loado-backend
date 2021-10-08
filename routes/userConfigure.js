const express = require("express");
const {
  getUserCheckBoxConfiguration,
  changeUserCheckBoxConfiguration,
  uploadProfilePic
} = require("../controllers/userConfigureController");

const router = express.Router();

const { protect } = require("../middleware/auth");

router
  .route("/viewbycheckbox")
  .get(protect, getUserCheckBoxConfiguration)
  .put(protect, changeUserCheckBoxConfiguration);

router.route("/uploadProfilePic").post(protect, uploadProfilePic)

module.exports = router;
