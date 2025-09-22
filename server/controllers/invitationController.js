const Invitation = require('../models/Invitation');
const User = require('../models/User');
const Workspace = require('../models/Workspace');
const Notification = require('../models/Notification'); // Make sure this is required

// @desc    Invite a user to a workspace
// @route   POST /api/invitations
// @access  Private
exports.inviteUser = async (req, res) => {
  const { email, workspaceId } = req.body;
  const fromUser = req.user;

  try {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (workspace.owner.toString() !== fromUser._id.toString()) {
      return res.status(403).json({ message: 'Only workspace owner can send invitations' });
    }

    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res.status(404).json({ message: 'User with this email does not exist in SyncSpace.' });
    }

    if (workspace.members.includes(userToInvite._id)) {
      return res.status(400).json({ message: 'User is already a member of this workspace.' });
    }
    
    const existingInvitation = await Invitation.findOne({ toEmail: email, workspace: workspaceId, status: 'pending' });
    if (existingInvitation) {
      return res.status(400).json({ message: 'An invitation has already been sent to this user for this workspace.' });
    }

    const newInvitation = new Invitation({
      fromUser: fromUser._id,
      toEmail: email,
      workspace: workspaceId,
    });
    await newInvitation.save();

    const newNotification = new Notification({
        user: userToInvite._id,
        message: `You have been invited by ${fromUser.name} to join the '${workspace.name}' workspace.`,
        link: `/invitations`
    });
    await newNotification.save();

    res.status(201).json({ message: 'Invitation sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Make sure your other functions are still here
exports.getPendingInvitations = async (req, res) => {
    const invitations = await Invitation.find({
      toEmail: req.user.email,
      status: 'pending',
    }).populate('fromUser', 'name').populate('workspace', 'name');
    res.json(invitations);
};

exports.acceptInvitation = async (req, res) => {
    const invitation = await Invitation.findById(req.params.id);

    if (!invitation || invitation.toEmail !== req.user.email) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({ message: 'Invitation has already been responded to' });
    }

    const workspace = await Workspace.findById(invitation.workspace);
    if (!workspace.members.includes(req.user._id)) {
        workspace.members.push(req.user._id);
        await workspace.save();
    }

    invitation.status = 'accepted';
    await invitation.save();

    res.json({ message: 'Invitation accepted successfully' });
};