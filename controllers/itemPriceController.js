const ItemPriceData = require("../models/ItemPrice");
const UserItemTrend = require("../models/UserItemTrend");
const LoadoLogs = require("../models/LoadoLogs");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc        Save Item price at certain datetime
// @route       GET /loado/api/itemPrice/setItemPrice
// @access      Public
exports.setItemPrice = asyncHandler(async (req, res, next) => {
  const dateValue = req.body.dateValue;
  const itemParam = req.body.jsonParam;

  itemParam.map((item) => {
    ItemPriceData.create({
      createdDttm: dateValue,
      itemName: item.itemName,
      itemPrice: item.itemPrice,
    });
  });

  await LoadoLogs.create({
    activity: "itemPriceLogAdded",
    stringParam: "",
  });

  return res.status(200).json({
    success: true,
  });
});

// @desc        Save User's interested items
// @route       POST /loado/api/itemPrice/setUserItemInterest
// @access      Private
exports.setUserItemInterest = asyncHandler(async (req, res, next) => {
  const findUserInterest = await UserItemTrend.find({ user: req.user._id });
  let stringLog = "";

  if (findUserInterest.length !== 0) {
    const output = await UserItemTrend.findByIdAndUpdate(
      findUserInterest[0]._id,
      {
        interestedItemsArray: req.body.itemCollection,
      }
    );
    stringLog = JSON.stringify({
      user: output._id,
      interestedItems: output.interestedItemsArray,
    });
  } else {
    const output = await UserItemTrend.create({
      user: req.user._id,
      interestedItemsArray: req.body.itemCollection,
    });
    stringLog = JSON.stringify({
      user: output._id,
      interestedItems: output.interestedItemsArray,
    });
  }

  LoadoLogs.create({
    activity: "setItemInterest",
    stringParam: stringLog,
  });

  return res.status(200).json({
    success: true,
  });
});

// @desc        Get User's interested items
// @route       GET /loado/api/itemPrice/getUserItemInterest
// @access      Private
exports.getUserItemInterest = asyncHandler(async (req, res, next) => {
  const findUserInterest = await UserItemTrend.find({ user: req.user._id });

  LoadoLogs.create({
    activity: "getItemInterest",
    stringParam: JSON.stringify(findUserInterest),
  });

  return res.status(200).json({
    success: true,
    userInterest:
      findUserInterest.length === 0
        ? []
        : findUserInterest[0].interestedItemsArray,
  });
});
