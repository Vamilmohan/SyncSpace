const Document = require('../models/documentModel');
const Workspace = require('../models/Workspace'); // CORRECTED: Changed 'workspaceModel' to 'Workspace'

// @desc    Get documents for a workspace
// @route   GET /api/documents/workspace/:workspaceId
// @access  Private
const getDocumentsByWorkspace = async (req, res) => {
  const { workspaceId } = req.params;
  const workspace = await Workspace.findById(workspaceId);

  // Check if user is a member of the workspace
  if (workspace && workspace.members.includes(req.user._id)) {
    const documents = await Document.find({ workspace: workspaceId }).populate('createdBy', 'name email').sort({ updatedAt: -1 });
    res.json(documents);
  } else {
    res.status(404);
    throw new Error('Workspace not found or user is not a member');
  }
};

// @desc    Create a document
// @route   POST /api/documents
// @access  Private
const createDocument = async (req, res) => {
  const { name, workspaceId } = req.body;
  if (!name || !workspaceId) {
    res.status(400);
    throw new Error('Please provide a name and workspace ID');
  }
  
  const document = new Document({
    name,
    workspace: workspaceId,
    createdBy: req.user._id,
  });

  const createdDocument = await document.save();
  res.status(201).json(createdDocument);
};

// @desc    Rename a document
// @route   PUT /api/documents/:id
// @access  Private
const renameDocument = async (req, res) => {
  const { name } = req.body;
  const document = await Document.findById(req.params.id);

  if (document) {
    if (document.createdBy.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to rename this document');
    }
    document.name = name;
    const updatedDocument = await document.save();
    res.json(updatedDocument);
  } else {
    res.status(404);
    throw new Error('Document not found');
  }
};

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (document) {
    if (document.createdBy.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this document');
    }
    await document.remove();
    res.json({ message: 'Document removed' });
  } else {
    res.status(404);
    throw new Error('Document not found');
  }
};

// @desc    Share a document
// @route   POST /api/documents/:id/share
// @access  Private
const shareDocument = async (req, res) => {
  const { userId } = req.body;
  const document = await Document.findById(req.params.id);

  if (document) {
    if (document.createdBy.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to share this document');
    }
    if (document.sharedWith.includes(userId)) {
      res.status(400);
      throw new Error('Document already shared with this user');
    }
    document.sharedWith.push(userId);
    await document.save();
    res.json({ message: 'Document shared successfully' });
  } else {
    res.status(404);
    throw new Error('Document not found');
  }
};

module.exports = {
  getDocumentsByWorkspace,
  createDocument,
  renameDocument,
  deleteDocument,
  shareDocument,
};