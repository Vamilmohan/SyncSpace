const Workspace = require('../models/Workspace');

// @desc    Create a new workspace
// @route   POST /api/workspaces
// @access  Private
exports.createWorkspace = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Please provide a workspace name' });
  }

  try {
    const workspace = new Workspace({
      name,
      owner: req.user._id, // req.user is from our auth middleware
      members: [req.user._id], // The creator is the first member
    });

    const createdWorkspace = await workspace.save();
    res.status(201).json(createdWorkspace);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user's workspaces
// @route   GET /api/workspaces
// @access  Private
exports.getWorkspaces = async (req, res) => {
  try {
    // Find all workspaces where the current user is a member
    const workspaces = await Workspace.find({ members: req.user._id });
    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};