const express = require('express');
const router = express.Router();
const { createColumn } = require('../controllers/boardController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createColumn);

module.exports = router;