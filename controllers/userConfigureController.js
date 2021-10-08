const User = require("../models/Users");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc        Get user's view_by_checkbox configuration
// @route       Get /API/v1/userConfigure/viewbycheckbox
// @access      Private
exports.getUserCheckBoxConfiguration = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorResponse("No user with this id", 404));
  }
  res.status(200).json({
    success: true,
    viewByCheckBox: user.viewByCheckBox,
  });
});

// @desc        Change user's view_by_checkbox configuration
// @route       PUT /API/v1/userConfigure/viewbycheckbox/:id
// @access      Private
exports.changeUserCheckBoxConfiguration = asyncHandler(
  async (req, res, next) => {
    let user = await User.findById(req.user._id);
    if (!user) {
      return next(new ErrorResponse("No user with this id", 404));
    }
    user = await User.findByIdAndUpdate(req.user._id, req.body);
    res.status(200).json({
      success: true,
    });
  }
);

// @desc        Upload Profile Pic
// @route       POST /API/v1/userConfigure/uploadProfilePic
// @access      Private
exports.uploadProfilePic = asyncHandler(async (req,res,next)=>{
  
  let user = await User.findById(req.user._id);
  if(!user){
    return next(new ErrorResponse("No user with this id", 404));
  }
  user = await User.findByIdAndUpdate(req.user._id, req.body);
  res.status(200).json({
    success: true
  })
})