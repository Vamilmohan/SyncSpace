const Comment = require('../models/Comment');
const Task = require('../models/Task');

// @desc    Add a comment to a task
// @route   POST /api/tasks/:taskId/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { taskId } = req.params;
    const author = req.user._id;

    const newComment = new Comment({
      content,
      author,
      task: taskId,
    });

    await newComment.save();

    // Add comment to task's comments array
    const task = await Task.findById(taskId);
    task.comments.push(newComment._id);
    await task.save();

    // Populate author details before sending back
    const populatedComment = await Comment.findById(newComment._id).populate('author', 'name email');

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all comments for a task
// @route   GET /api/tasks/:taskId/comments
// @access  Private
exports.getCommentsForTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const comments = await Comment.find({ task: taskId })
      .populate('author', 'name email')
      .sort({ createdAt: 'asc' });
      
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};