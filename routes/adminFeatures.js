const express = require('express');
const {
  updateLoginDate,
  changeAllPeopleNotification,
  getDailyLogCounts,
} = require('../controllers/adminController');

const router = express.Router();

const { protectAdmin } = require('../middleware/auth');

router.route('/updateLoginDate').post(protectAdmin, updateLoginDate);
router
  .route('/changeAllPeopleNotification')
  .put(protectAdmin, changeAllPeopleNotification);
router.route('/adminData/dailyLogsData').get(protectAdmin, getDailyLogCounts);

module.exports = router;
