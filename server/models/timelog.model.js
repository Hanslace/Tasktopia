import mongoose from 'mongoose';

const TimeLogSchema = new mongoose.Schema({
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hours: { type: Number, required: true },
    date: { type: Date, default: Date.now }
  });
  
  const TimeLog = mongoose.model('TimeLog', TimeLogSchema);
  export default TimeLog;