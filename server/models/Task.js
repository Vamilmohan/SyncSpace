import mongoose from 'mongoose';

const taskSchema = mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      required: true,
      enum: ['To Do', 'In Progress', 'Review', 'Done'],
      default: 'To Do',
    },
    workspace: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Workspace' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true }
);

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

export default Task;