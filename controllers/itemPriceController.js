const ItemPriceData = require('../models/ItemPrice');
const LoadoLogs = require("../models/LoadoLogs");
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc        Save Item price at certain datetime
// @route       GET /loado/api/itemPrice/setItemPrice
// @access      Public
exports.setItemPrice = asyncHandler(async (req, res, next) => {
  const dateValue = req.body.dateValue;
  const itemParam = req.body.jsonParam;

  itemParam.map(item => {
    ItemPriceData.create({
      createdDttm: dateValue,
      itemName: item.itemName,
      itemPrice: item.itemPrice
    })
  });

  await LoadoLogs.create({
    user: "biglol",
    activity: "itemPriceLogAdded",
    stringParam: "",
  });

  return res.status(200).json({
    success: true,
  });
});
