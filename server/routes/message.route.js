import express from 'express';
import auth from '../middleware/auth.js';
import Message from '../models/message.model.js';

const router = express.Router();

// @route   POST api/messages
// @desc    Send a message
router.post('/', auth, async (req, res) => {
  const { conversationId, text } = req.body;
  try {
    const message = new Message({
      conversationId,
      sender: req.user.id,
      text,
    });

    await message.save();

    // Emit real-time event
    const io = req.app.get('socketio');
    io.to(conversationId).emit('receiveMessage', message);

    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/messages/:conversationId
// @desc    Get all messages in a conversation
router.get('/:conversationId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .populate('sender', 'name')
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;