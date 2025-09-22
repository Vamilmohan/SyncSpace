const express = require('express');
const router = express.Router();
const { 
  inviteUser, 
  getPendingInvitations, 
  acceptInvitation 
} = require('../controllers/invitationController');
const { protect } = require('../middleware/authMiddleware');

// Route to send a new invitation
router.route('/').post(protect, inviteUser);

// Route to get pending invitations for the logged-in user
router.route('/pending').get(protect, getPendingInvitations);

// Route to accept an invitation
router.route('/:id/accept').post(protect, acceptInvitation);

module.exports = router;