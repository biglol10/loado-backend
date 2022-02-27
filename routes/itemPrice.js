const express = require('express');

const {
  getItemPrice,
  setItemPrice,
  setUserItemInterest,
  getUserItemInterest,
  getUserItemInterestPriceTrend,
  calculateItemPriceAverage,
  getItemCollectionPrice,
} = require('../controllers/itemPriceController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router
  .route('/getItemPrice/:itemName/:dateStartParam/:dateEndParam')
  .get(getItemPrice);
router.route('/setItemPrice').post(setItemPrice);
router
  .route('/userItemInterest')
  .get(protect, getUserItemInterest)
  .post(protect, setUserItemInterest);

router.route('/calculateItemPriceAverage').get(calculateItemPriceAverage);

router.route('/getItemCollectionPrice').post(protect, getItemCollectionPrice);

module.exports = router;
