import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true },
    description: String,
    status: { type: String, enum: ['to_do', 'in_progress', 'completed'], default: 'to_do' },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueDate: Date,
    timeLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TimeLog' }],
  },
  {
    timestamps: true, // createdAt, updatedAt
    });
  
  const Task = mongoose.model('Task', TaskSchema);
    export default Task;