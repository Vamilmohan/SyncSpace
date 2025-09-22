const Task = require('../models/Task'); // CORRECTED: Now looks for Task.js
const Workspace = require('../models/Workspace');

// @desc    Get all tasks for a workspace
// @route   GET /api/tasks/workspace/:workspaceId
// @access  Private
const getTasksByWorkspace = async (req, res) => {
  const { workspaceId } = req.params;
  const workspace = await Workspace.findById(workspaceId);

  if (workspace && workspace.members.includes(req.user._id)) {
    const tasks = await Task.find({ workspace: workspaceId });
    res.json(tasks);
  } else {
    res.status(404);
    throw new Error('Workspace not found or user is not a member');
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  const { title, description, workspaceId } = req.body;

  if (!title || !workspaceId) {
    res.status(400);
    throw new Error('Title and workspace ID are required');
  }

  const task = new Task({
    title,
    description,
    workspace: workspaceId,
    createdBy: req.user._id,
  });

  const createdTask = await task.save();
  res.status(201).json(createdTask);
};

// @desc    Update a task (title, description, or status)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const { title, description, status } = req.body;
  const task = await Task.findById(req.params.id);

  if (task) {
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
};

module.exports = {
  getTasksByWorkspace,
  createTask,
  updateTask,
  deleteTask,
};