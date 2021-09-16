const User = require("../models/Users");
const UserLoado = require("../models/UserLoado");
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
