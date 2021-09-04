const express = require('express');
const {
  getHomeworks,
  createHomework,
  updateHomework,
  deleteHomework,
  getUserHomeworks,
  updateDailyHomework,
  updatePersonalHomework,
} = require('../controllers/hwController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/').get(protect, getUserHomeworks).post(protect, createHomework);
router
  .route('/:id')
  .put(protect, updateHomework)
  .delete(protect, deleteHomework);
// .get(getUserHomeworks)

// router.route("/loadoupdatework").post(protect, updateDailyHomework);
router.route('/loadoupdatework').get(updateDailyHomework);
router.route('/loadoupdatepersonal').post(protect, updatePersonalHomework);

module.exports = router;
