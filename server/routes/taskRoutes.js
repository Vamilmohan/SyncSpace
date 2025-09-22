const express = require('express');
const router = express.Router();
const {
  getTasksByWorkspace,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/workspace/:workspaceId').get(getTasksByWorkspace);
router.route('/').post(createTask);
router.route('/:id').put(updateTask).delete(deleteTask);

module.exports = router;