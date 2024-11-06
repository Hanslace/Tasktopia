import express from 'express';
import auth from '../middleware/auth.js';
import Task from '../models/task.model.js';
import ActivityLog from '../models/activitylog.model.js';

const router = express.Router();

// @route   POST api/tasks
// @desc    Create a task
router.post('/', auth, async (req, res) => {
  const { projectId, title, description, assigneeId, priority, dueDate } = req.body;

  try {
    const task = new Task({
      project: projectId,
      title,
      description,
      assignee: assigneeId,
      priority,
      dueDate,
    });

    await task.save();

    // Log activity
    await new ActivityLog({
      user: req.user.id,
      action: 'Created task',
      details: task.title,
    }).save();

    // Emit event to notify clients of new task creation
    const io = req.app.get('socketio');
    io.emit('taskCreated', task);

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/tasks/:id
// @desc    Get a single task by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: 'Task not found' });

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/tasks/:id
// @desc    Update a task
router.put('/:id', auth, async (req, res) => {
  const { title, description, priority, status, dueDate } = req.body;

  try {
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: 'Task not found' });

    // Update task fields
    task.title = title || task.title;
    task.description = description || task.description;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;

    await task.save();

    // Log activity
    await new ActivityLog({
      user: req.user.id,
      action: 'Updated task',
      details: task.title,
    }).save();

    // Emit event to notify clients of task update
    const io = req.app.get('socketio');
    io.emit('taskUpdated', task);

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: 'Task not found' });

    await task.remove();

    // Log activity
    await new ActivityLog({
      user: req.user.id,
      action: 'Deleted task',
      details: task.title,
    }).save();

    // Emit event to notify clients of task deletion
    const io = req.app.get('socketio');
    io.emit('taskDeleted', { taskId: req.params.id });

    res.json({ msg: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;