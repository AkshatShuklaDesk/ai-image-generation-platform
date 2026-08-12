const express = require('express');
const router = express.Router();
const ImageGeneration = require('../models/ImageGeneration');
const ChatSession = require('../models/ChatSession');
const { protect } = require('../middleware/authMiddleware');

const generateImageWithHF = async (prompt) => {
  const model = "stabilityai/stable-diffusion-xl-base-1.0";
  const hfToken = process.env.HF_API_TOKEN;

  if (!hfToken) {
    throw new Error('Hugging Face API token is missing');
  }

  const response = await fetch(
    `https://api-inference.huggingface.co/models/${model}`,
    {
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: prompt }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hugging Face API error: ${errorText}`);
  }

  const buffer = await response.arrayBuffer();
  const base64Image = Buffer.from(buffer).toString('base64');
  return `data:image/jpeg;base64,${base64Image}`;
};

router.post('/', protect, async (req, res) => {
  const { prompt, sessionId } = req.body;

  if (!prompt || !sessionId) {
    return res.status(400).json({ message: 'Prompt and Session ID are required' });
  }

  try {
    const session = await ChatSession.findById(sessionId);
    if (!session || session.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Session not found or not authorized' });
    }

    const imageUrl = await generateImageWithHF(prompt);

    const newGeneration = new ImageGeneration({
      session: sessionId,
      user: req.user._id,
      prompt,
      imageUrl
    });

    const savedGeneration = await newGeneration.save();
    res.status(201).json(savedGeneration);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Image generation failed' });
  }
});

router.get('/session/:sessionId', protect, async (req, res) => {
  try {
    const generations = await ImageGeneration.find({ 
      session: req.params.sessionId,
      user: req.user._id 
    }).sort({ createdAt: 1 });
    
    res.json(generations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/history', protect, async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword 
    ? { 
        prompt: { 
          $regex: req.query.keyword, 
          $options: 'i' 
        } 
      } 
    : {};

  try {
    const count = await ImageGeneration.countDocuments({ user: req.user._id, ...keyword });
    const generations = await ImageGeneration.find({ user: req.user._id, ...keyword })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ generations, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
