import express from 'express';
import auth from '../middleware/auth.js';
import TimeLog from '../models/timelog.model.js';

const router = express.Router();

// @route   POST api/timelogs
// @desc    Log time for a task
router.post('/', auth, async (req, res) => {
  const { taskId, hours } = req.body;

  try {
    const timeLog = new TimeLog({
      task: taskId,
      user: req.user.id,
      hours
    });

    await timeLog.save();

    res.json(timeLog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Additional routes as needed...
export default router;
