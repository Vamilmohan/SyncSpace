const express = require('express');
const router = express.Router();
const {
  getDocumentsByWorkspace,
  createDocument,
  renameDocument,
  deleteDocument,
  shareDocument,
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/').post(createDocument);
router.route('/workspace/:workspaceId').get(getDocumentsByWorkspace);
router.route('/:id').put(renameDocument).delete(deleteDocument);
router.route('/:id/share').post(shareDocument);

module.exports = router;