const express = require("express");

const {
  register,
  login,
  checkNotification,
  changeNotification,
} = require("../controllers/auth");

const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/checkNotification").post(protect, checkNotification);
router.route("/changeNotification").post(protect, changeNotification);

module.exports = router;
