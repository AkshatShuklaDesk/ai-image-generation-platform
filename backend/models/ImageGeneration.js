const mongoose = require('mongoose');

const imageGenerationSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'ChatSession'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  prompt: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
}, { timestamps: true });

const ImageGeneration = mongoose.model('ImageGeneration', imageGenerationSchema);
module.exports = ImageGeneration;
