const ItemPriceData = require("../models/ItemPrice");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc        Save Item price at certain datetime
// @route       GET /loado/api/itemPrice/setItemPrice
// @access      Public
exports.setItemPrice = asyncHandler(async (req, res, next) => {

    const itemName = req.query.itemName;
    const itemPrice = req.query.itemPrice;
    const createdDttm = req.query.dateValue;

    // https://stackoverflow.com/questions/9145667/how-to-post-json-to-a-server-using-c

    await ItemPriceData.create({
        createdDttm,
        itemName,
        itemPrice
    });

    const userHomeworks = await UserLoado.find().sort("idx");
    //   const result = userHomeworks.skip(skip).limit(limit);
  
    res.status(200).json({
      success: true,
      dataLength: userHomeworks.length,
      data: userHomeworks,
    });
  });