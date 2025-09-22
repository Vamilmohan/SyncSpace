const express = require('express');
const router = express.Router();
const { getBoard } = require('../controllers/boardController');
const { protect } = require('../middleware/authMiddleware');

// This route will get all board data for a specific workspace
router.route('/:workspaceId').get(protect, getBoard);

module.exports = router;