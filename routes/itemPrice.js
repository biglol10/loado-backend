const express = require('express');

const { setItemPrice } = require('../controllers/itemPriceController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/setItemPrice').post(setItemPrice);

module.exports = router;
