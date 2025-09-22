const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.role = req.body.role || user.role;
    if (req.body.notificationSettings) {
        user.notificationSettings = { ...user.notificationSettings, ...req.body.notificationSettings };
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      role: updatedUser.role,
      notificationSettings: updatedUser.notificationSettings,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Change user password
// @route   PUT /api/users/profile/change-password
// @access  Private
const changeUserPassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(currentPassword))) {
        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(401);
        throw new Error('Invalid current password');
    }
};

module.exports = { updateUserProfile, changeUserPassword };