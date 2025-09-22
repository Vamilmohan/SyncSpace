const express = require('express');
const router = express.Router();
const { createWorkspace, getWorkspaces } = require('../controllers/workspaceController');
// CORRECTED: The function name now matches the export
const { getDocumentsByWorkspace } = require('../controllers/documentController'); 
const { protect } = require('../middleware/authMiddleware');

// All routes here will be protected by the 'protect' middleware
router.route('/').post(protect, createWorkspace).get(protect, getWorkspaces);

// CORRECTED: Using the correctly imported function name here
router.route('/:workspaceId/documents').get(protect, getDocumentsByWorkspace);

module.exports = router;