const express = require('express');
const router = express.Router();
const { updateUserProfile, changeUserPassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile').put(protect, updateUserProfile);
router.route('/profile/change-password').put(protect, changeUserPassword);

module.exports = router;