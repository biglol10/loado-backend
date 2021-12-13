const express = require('express');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/setItemPrice').get(getUserHomeworks);