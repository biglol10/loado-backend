const express = require("express");
const { updateLoginDate } = require("../controllers/adminController");

const router = express.Router();

const { protectAdmin } = require("../middleware/auth");

router.route("/updateLoginDate").post(protectAdmin, updateLoginDate);

module.exports = router;
