const ItemPriceData = require('../models/ItemPrice');
const UserItemTrend = require('../models/UserItemTrend');
const LoadoLogs = require('../models/LoadoLogs');
const ItemPriceAverage = require('../models/ItemPriceAverage');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const fs = require('fs');
var path = require('path');
var moment = require('moment');

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
    activity: 'itemPriceLogAdded',
    stringParam: '',
  });

  return res.status(200).json({
    success: true,
  });
});

// @desc        Save User's interested items
// @route       POST /loado/api/itemPrice/userItemInterest
// @access      Private
exports.setUserItemInterest = asyncHandler(async (req, res, next) => {
  const findUserInterest = await UserItemTrend.find({ user: req.user._id });
  let stringLog = '';

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
    activity: 'setItemInterest',
    stringParam: stringLog,
  });

  return res.status(200).json({
    success: true,
  });
});

// @desc        Get User's interested items
// @route       GET /loado/api/itemPrice/userItemInterest
// @access      Private
exports.getUserItemInterest = asyncHandler(async (req, res, next) => {
  const findUserInterest = await UserItemTrend.find({ user: req.user._id });

  LoadoLogs.create({
    activity: 'getItemInterest',
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

// @desc        Get User's interested items price trend
// @route       GET /loado/api/itemPrice/getUserItemInterestPriceTrend
// @access      Private
exports.getUserItemInterestPriceTrend = asyncHandler(async (req, res, next) => {
  const findUserInterest = await UserItemTrend.find({ user: req.user._id });

  LoadoLogs.create({
    activity: 'getItemInterestPriceTrend',
    stringParam: JSON.stringify(findUserInterest),
  });

  if (findUserInterest.length === 0) {
    return res.status(200).json({
      success: true,
      userInterestPriceTrend: [],
    });
  }

  const itemArray = findUserInterest[0].interestedItemsArray;
});

// @desc        POST Item Collection Price
// @route       POST /loado/api/itemPrice/getItemCollectionPrice
// @access      Private
exports.getItemCollectionPrice = asyncHandler(async (req, res, next) => {
  const userItemCollection = req.body.userItemCollection;
  console.log(userItemCollection);
  let dataJson = {};
  const dateValue = moment().add(-7, 'days').format('YYYY-MM-DD');
  Promise.all(
    userItemCollection.map(async (item) => {
      dataJson[item] = await ItemPriceAverage.find({
        itemName: item.replace('I_', ''),
        createdDttm: { $gte: dateValue },
      })
        .select('-_id')
        .select('-itemName')
        .select('-__v')
        .sort('createdDttm');

      // dataJson[item].map(item => item.itemName)
    })
  ).then((param) => {
    return res.status(200).json({
      success: true,
      itemCollectionPrice: dataJson,
    });
  });
});

// @desc        Calculate Item Price Average for each day
// @route       GET /loado/api/itemPrice/calculateItemPriceAverage
// @access      Public
exports.calculateItemPriceAverage = asyncHandler(async (req, res, next) => {
  const itemList = JSON.parse(
    fs.readFileSync(`${__dirname}/../_data/itemList.json`, 'utf-8')
  );

  try {
    for (let index = 0; index < 7; index++) {
      const dateValue = moment()
        .tz('Asia/Seoul')
        .add(index * -1, 'days')
        .format('YYYY-MM-DD');

      itemList.map(async (item) => {
        const itemElement = item.item.replace('I_', '');

        const itemFilter = await ItemPriceData.find({
          createdDttm: { $regex: dateValue, $options: 'i' },
          itemName: itemElement,
        });

        if (itemFilter.length === 0) return;

        const averageValue = Math.floor(
          itemFilter.reduce((sum, item) => sum + item.itemPrice, 0) /
            itemFilter.length
        );

        const getExistingLog = await ItemPriceAverage.find({
          createdDttm: dateValue,
          itemName: itemElement,
        });

        if (getExistingLog.length !== 0) {
          ItemPriceAverage.findByIdAndUpdate(getExistingLog[0]._id, {
            createdDttm: dateValue,
            itemName: itemElement,
            itemPriceAverage: averageValue,
          });
        } else {
          ItemPriceAverage.create({
            createdDttm: dateValue,
            itemName: itemElement,
            itemPriceAverage: averageValue,
          });
        }
      });
    }
    LoadoLogs.create({
      activity: 'itemAverageCalculated',
      stringParam: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
  } catch (error) {
    LoadoLogs.create({
      activity: 'itemAverageCalculatedError',
      stringParam: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
  }

  return res.status(200).json({
    success: true,
  });

  // const averageCalculate = await ItemPriceData.aggregate(
  //   [
  //     {
  //       $match: {
  //         createdDttm: { $regex: "2022-01-20", $options: "i" },
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: "$itemName",
  //         average_weight: { $avg: Number("$itemPrice") }
  //       },
  //     },
  //   ],
  //   function (err, result) {
  //     console.log("errorerror");
  //     console.log(err);
  //     console.log("resultresult");
  //     console.log(result);
  //   }
  // );
});
