const express = require("express");

const {
  setItemPrice,
  setUserItemInterest,
  getUserItemInterest,
  getUserItemInterestPriceTrend,
  calculateItemPriceAverage,
} = require("../controllers/itemPriceController");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.route("/setItemPrice").post(setItemPrice);
router
  .route("/userItemInterest")
  .get(protect, getUserItemInterest)
  .post(protect, setUserItemInterest);

router
  .route("/calculateItemPriceAverage")
  .get(protect, calculateItemPriceAverage);

module.exports = router;
