const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  toEmail: {
    type: String,
    required: true,
    lowercase: true,
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Invitation', invitationSchema);