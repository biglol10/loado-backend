const User = require("../models/Users");
const UserLoado = require("../models/UserLoado");
const LoadoLogs = require("../models/LoadoLogs");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
var moment = require("moment");

// ************ Admin functionality ************

// @desc        Update users' lastLogin whose lastLogin value is null
// @route       POST /loado/api/adminFeatures/updateLoginDate
// @access      Private
exports.updateLoginDate = asyncHandler(async (req, res, next) => {
  const users = await User.find({ lastLogin: { $eq: null } });
  users.map((user, idx) => {
    user.lastLogin = "2021-09-14 00:00:00";
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
  let dayMinus = 9;
  if (process.env.BACKEND_URL.indexOf("loado-app") >= 0) dayMinus = 0;

  const logArray = [];
  for (let index = 0; index < 7; index++) {
    const startDate =
      moment()
        .add((index + 1) * -1, "days")
        .format("YYYY-MM-DD") + " 15:00:00";
    const endDate =
      moment()
        .add(index * -1, "days")
        .format("YYYY-MM-DD") + " 15:00:00";
    const dateValue = moment()
      .add(index * -1, "days")
      .add(dayMinus, "hours")
      .format("YYYY-MM-DD");
    console.log(
      `startDate is ${startDate}, endDate is ${endDate}, dateValue is ${moment()
        .add(index * -1, "days")
        .add(dayMinus, "hours")}`
    );

    const logsCount = await LoadoLogs.find()
      .where("createdDttm")
      .gt(startDate)
      .lt(endDate)
      .select("-stringParam")
      .countDocuments();

    logArray.push({
      dateValue,
      count: logsCount,
    });
  }

  const userCount = await User.find().countDocuments();
  const hwCount = await UserLoado.find().countDocuments();
  const logsCount = await LoadoLogs.find().countDocuments();

  let groupFailSuccess = false;
  let jobGroupingResult;

  await LoadoLogs.create({
    activity: "viewDashboard",
  });

  // 케릭터 별 그룹핑 카운트
  await UserLoado.aggregate(
    [
      {
        $group: {
          _id: "$character",
          characterCount: {
            $sum: 1,
          },
        },
      },
    ],
    function (err, result) {
      if (err) {
        groupFailSuccess = false;
        res.status(200).json({
          success: true,
          groupFailSuccess,
          log: logArray,
          userCount,
          hwCount,
          logsCount,
        });
      } else {
        groupFailSuccess = true;
        jobGroupingResult = result;
        res.status(200).json({
          success: true,
          groupFailSuccess,
          log: logArray,
          userCount,
          hwCount,
          logsCount,
          jobGroupingResult,
        });
      }
    }
  );
});

// @desc        Delete loado logs
// @route       DELETE /api/v1/auth/deleteDailyLogs
// @access      Private
exports.deleteLoadoLogs = asyncHandler(async (req, res, next) => {
  if (process.env.UPDATE_KEY !== req.query.key) {
    res.status(403).json({ success: false });
    return;
  }

  const week = moment().add(-7, "days").format("YYYY-MM-DD") + " 15:00:00";

  const logsCount = await LoadoLogs.deleteMany({
    createdDttm: {
      $lt: week,
    },
  });

  await LoadoLogs.create({
    activity: "deleteOldLogs",
  });

  res.status(200).json({
    success: true,
  });
});
