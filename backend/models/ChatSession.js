const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    default: 'New Chat'
  }
}, { timestamps: true });

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);
module.exports = ChatSession;
