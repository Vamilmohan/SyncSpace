const Workspace = require('../models/Workspace');
const Column = require('../models/Column');
const Task = require('../models/Task');

// @desc    Get full board data for a workspace
// @route   GET /api/boards/:workspaceId
// @access  Private
exports.getBoard = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // First, check if the user is a member of the workspace
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace || !workspace.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized for this workspace' });
    }

    // Find all columns for the workspace and populate their tasks
    const columns = await Column.find({ workspace: workspaceId }).populate('tasks');

    res.json(columns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
// @desc    Create a new column
// @route   POST /api/columns
// @access  Private
exports.createColumn = async (req, res) => {
  const { name, workspaceId } = req.body;

  if (!name || !workspaceId) {
    return res.status(400).json({ message: 'Please provide a name and workspaceId' });
  }

  try {
    // Make sure to require the Column model at the top of the file
    const Column = require('../models/Column');

    const column = new Column({
      name,
      workspace: workspaceId,
    });

    const createdColumn = await column.save();
    res.status(201).json(createdColumn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
// @desc    Create a new task in a column
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  const { title, columnId, workspaceId } = req.body;

  if (!title || !columnId || !workspaceId) {
    return res.status(400).json({ message: 'Please provide title, columnId, and workspaceId' });
  }

  try {
    // Make sure to require the Task and Column models at the top of the file
    const Task = require('../models/Task');
    const Column = require('../models/Column');

    const task = new Task({
      title,
      column: columnId,
      workspace: workspaceId,
    });

    const createdTask = await task.save();

    // Also, add the task to the column's tasks array
    const column = await Column.findById(columnId);
    column.tasks.push(createdTask._id);
    await column.save();

    res.status(201).json(createdTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
// @desc    Move a task to a new column and/or position
// @route   PUT /api/tasks/:taskId/move
// @access  Private
exports.moveTask = async (req, res) => {
  const { taskId } = req.params;
  const { newColumnId, oldColumnId, newIndex } = req.body;

  try {
    const Task = require('../models/Task');
    const Column = require('../models/Column');

    // Update the task's column field
    await Task.findByIdAndUpdate(taskId, { column: newColumnId });

    // Remove task from old column's tasks array
    await Column.findByIdAndUpdate(oldColumnId, { $pull: { tasks: taskId } });

    // Add task to new column's tasks array at the correct position
    await Column.findByIdAndUpdate(newColumnId, {
      $push: { tasks: { $each: [taskId], $position: newIndex } },
    });

    res.status(200).json({ message: 'Task moved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};