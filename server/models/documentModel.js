const mongoose = require('mongoose');

const documentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    content: {
      type: String, // For a simple text editor; could be more complex (e.g., JSON for block-based editors)
      default: '',
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Workspace',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
