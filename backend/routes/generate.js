const express = require('express');
const fetch = require('node-fetch');
const db = require('../db');
const auth = require('../middleware/auth');


const router = express.Router();
router.use(auth);

async function generateImage(prompt){
    const encoded = encodeURIComponent(prompt);
    const url = 'https'
    const check = await fetch(url, { method: 'GET' });
    if (!check.ok) throw new Error('Image generation failed');
    return url;
}

router.post('/:sessionId', async (req, res) => {
    const {prompt} = req.body;
    if(!prompt) return res.status(400).json({ error: 'Prompt is needed'});

    try{
        const imageUrl = await generateImage(prompt);
        const info = db.prepare(
            'INSERT INTO image_generations (session_id, user_id, prompt, image_url) VALUES (?, ?, ?, ?)').run(req.params.sessionsId, req.userId, prompt, image_url);

            res.json({
                id: info.lastInsertRowid,
                prompt,
                image_url: imageUrl,
                session_id: req.params.sessionsId,

            });
        } catch (err) {
            res.status(500).json({ error: 'Image generation failed', details: err.message});

        }
        });

        module.exports = router;