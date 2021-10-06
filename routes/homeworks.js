const express = require("express");
const {
  getHomeworks,
  getOneHomework,
  createHomework,
  updateHomework,
  deleteHomework,
  getUserHomeworks,
  updateDailyHomework,
  updatePersonalHomework,
  getAllUserHomeworks,
  cronTest,
} = require("../controllers/hwController");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.route("/").get(protect, getUserHomeworks).post(protect, createHomework);
router
  .route("/:id")
  .get(protect, getOneHomework)
  .put(protect, updateHomework)
  .delete(protect, deleteHomework);

router.route("/getAllHomework").get(protect, getAllUserHomeworks);

// router.route("/loadoupdatework").post(protect, updateDailyHomework);
router.route("/loadoupdatework").get(updateDailyHomework);
router.route("/loadoupdatepersonal").post(protect, updatePersonalHomework);

// node-cron test
router.route("/crontest").get(cronTest);

module.exports = router;
