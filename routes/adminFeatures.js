const express = require("express");
const {
  updateLoginDate,
  changeAllPeopleNotification,
  getDailyLogCounts,
  deleteLoadoLogs,
} = require("../controllers/adminController");

const router = express.Router();

const { protect, protectAdmin } = require("../middleware/auth");

router.route("/updateLoginDate").post(protectAdmin, updateLoginDate);
router
  .route("/changeAllPeopleNotification")
  .put(protectAdmin, changeAllPeopleNotification);
router
  .route("/adminData/dailyLogsData")
  .get(protect, getDailyLogCounts)
  .delete(deleteLoadoLogs);

module.exports = router;
