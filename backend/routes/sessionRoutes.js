const express = require('express');
const router = express.Router();
const ChatSession = require('../models/ChatSession');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    const sessions = await ChatSession.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { title } = req.body;
    const session = new ChatSession({
      user: req.user._id,
      title: title || 'New Chat'
    });
    const createdSession = await session.save();
    res.status(201).json(createdSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const session = await ChatSession.findById(req.params.id);

    if (session) {
      if (session.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      session.title = req.body.title || session.title;
      const updatedSession = await session.save();
      res.json(updatedSession);
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const session = await ChatSession.findById(req.params.id);

    if (session) {
      if (session.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      await session.deleteOne();
      res.json({ message: 'Session removed' });
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
