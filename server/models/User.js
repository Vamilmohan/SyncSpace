const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    githubId: { type: String },
    bio: { type: String, maxLength: 250, default: '' },
    role: {
      type: String,
      enum: ['Developer', 'Designer', 'Project Manager', 'Client', 'Not Specified'],
      default: 'Not Specified',
    },
    notificationSettings: {
      onMention: { type: Boolean, default: true },
      onNewTask: { type: Boolean, default: true },
      weeklySummary: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;