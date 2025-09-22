const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// Route to get all notifications for the logged-in user
router.route('/').get(protect, getNotifications);

// Route to mark a specific notification as read
router.route('/:id/read').put(protect, markAsRead);

module.exports = router;