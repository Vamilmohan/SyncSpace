const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { // The user who will receive the notification
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  link: { // A URL to the relevant item (e.g., /workspace/123)
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);