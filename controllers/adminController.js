const User = require('../models/Users');
const UserLoado = require('../models/UserLoado');
const LoadoLogs = require('../models/LoadoLogs');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
var moment = require('moment');

// ************ Admin functionality ************

// @desc        Update users' lastLogin whose lastLogin value is null
// @route       POST /loado/api/adminFeatures/updateLoginDate
// @access      Private
exports.updateLoginDate = asyncHandler(async (req, res, next) => {
  const users = await User.find({ lastLogin: { $eq: null } });
  users.map((user, idx) => {
    user.lastLogin = '2021-09-14 00:00:00';
    user.save();
  });
  res.status(200).json({
    success: true,
    dataLength: users.length,
    data: users,
  });
});

// @desc        Change all users' notification to true
// @route       POST /api/v1/auth/changeAllPeopleNotification
// @access      Private
exports.changeAllPeopleNotification = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  users.map((user) => {
    user.newNotice = true;
    user.save();
  });

  res.status(200).json({
    success: true,
  });
});

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

// @desc        Get User log counts
// @route       GET /api/v1/auth/getDailyLogCounts
// @access      Private
exports.getDailyLogCounts = asyncHandler(async (req, res, next) => {
  const logArray = [];
  for (let index = 0; index < 7; index++) {
    const startDate =
      moment()
        .add((index + 1) * -1, 'days')
        .format('YYYY-MM-DD') + ' 15:00:00';
    const endDate =
      moment()
        .add(index * -1, 'days')
        .format('YYYY-MM-DD') + ' 15:00:00';
    const dateValue = moment()
      .add((index + 1) * -1, 'days')
      .add(9, 'hours')
      .format('YYYY-MM-DD');

    const logsCount = await LoadoLogs.find()
      .where('createdDttm')
      .gt(startDate)
      .lt(endDate)
      .select('-stringParam')
      .countDocuments();

    logArray.push({
      dateValue,
      count: logsCount,
    });
  }

  const userLoginCount = await User.find()
    .where('lastLogin')
    .gt(moment().add(-1, 'days').format('YYYY-MM-DD') + ' 15:00:00')
    .lt(moment().add(0, 'days').format('YYYY-MM-DD') + ' 15:00:00')
    .countDocuments();

  res.status(200).json({
    success: true,
    log: logArray,
    userLoginCount,
  });
});
