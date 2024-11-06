import express from 'express';
import auth from '../middleware/auth.js';
import ActivityLog from '../models/activitylog.model.js';

const router = express.Router();

// @route   GET api/activityLogs
// @desc    Get activity logs for a user
router.get('/', auth, async (req, res) => {
  try {
    const logs = await ActivityLog.find({ user: req.user.id }).sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;