const User = require("../models/Users");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc        Register user
// @route       POST /API/v1/auth/register
// @access      Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, userId, password } = req.body;

  var moment = require("moment");
  require("moment-timezone");
  moment.tz.setDefault("Asia/Seoul");
  let m_date = moment();
  let lastLogin = m_date.format("YYYY-MM-DD HH:mm:ss");

  // Create user
  // name: name, userId: userId ... the keys should match with the model
  const user = await User.create({
    name,
    userId,
    password,
    lastLogin,
  });

  //   // Create Token
  //   // not capital U because it is not static... static would be called on the method itself and method is called on the actual user
  //   const token = user.getSignedJwtToken();

  //   res.status(200).json({ success: true, token });
  sendTokenResponse(user, 200, res);
});

// @desc        Login user
// @route       POST /api/v1/auth/login
// @access      Public
exports.login = asyncHandler(async (req, res, next) => {
  const { userId, password } = req.body;
  if (!userId || !password) {
    return next(new ErrorResponse("아이디/비밀번호를 입력해주세요", 400));
  }

  // Check for user
  const user = await User.findOne({ userId }).select("+password"); // since password select is false
  if (!user) {
    return next(new ErrorResponse("로그인에 실패했습니다", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password.toString());

  if (!isMatch) {
    return next(new ErrorResponse("로그인에 실패했습니다", 401));
  }

  var moment = require("moment");
  require("moment-timezone");
  moment.tz.setDefault("Asia/Seoul");
  let m_date = moment();
  let date = m_date.format("YYYY-MM-DD HH:mm:ss");

  user.lastLogin = date;

  await user.save();

  //   // Create token
  //   const token = user.getSignedJwtToken();

  //   res.status(200).json({ success: true, token });

  sendTokenResponse(user, 200, res);
});

// @desc        Check if there is new notification
// @route       POST /api/v1/auth/newNotification
// @access      Private
exports.checkNotification = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc        Change the notification to false
// @route       POST /api/v1/auth/changeNotification
// @access      Private
exports.changeNotification = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  user.newNotice = false;
  await user.save();
  res.status(200).json({
    success: true,
  });
});

// @desc        Change all users' notification to true
// @route       POST /api/v1/auth/changeAllPeopleNotification
// @access      Private
exports.changeAllPeopleNotification = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  console.log(users[0]);
  console.log(users.length);
  res.status(200).json({
    success: true,
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // only want the cookie to be access through client side script
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true; // https (production)
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token, userName: user.name });
};
