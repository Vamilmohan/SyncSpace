const express = require('express');
// We need to merge params from the parent router (tasks)
const router = express.Router({ mergeParams: true }); 
const { addComment, getCommentsForTask } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addComment)
  .get(protect, getCommentsForTask);

module.exports = router;