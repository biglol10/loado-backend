const express = require("express");

const {
  setItemPrice,
  setUserItemInterest,
  getUserItemInterest,
} = require("../controllers/itemPriceController");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.route("/setItemPrice").post(setItemPrice);
router
  .route("/userItemInterest")
  .get(protect, getUserItemInterest)
  .post(protect, setUserItemInterest);

module.exports = router;
