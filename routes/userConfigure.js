const express = require("express");
const {
  getUserCheckBoxConfiguration,
  changeUserCheckBoxConfiguration,
} = require("../controllers/userConfigureController");

const router = express.Router();

const { protect } = require("../middleware/auth");

router
  .route("/viewbycheckbox")
  .get(protect, getUserCheckBoxConfiguration)
  .put(protect, changeUserCheckBoxConfiguration);

module.exports = router;
