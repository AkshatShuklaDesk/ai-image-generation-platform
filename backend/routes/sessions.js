const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', (req, res) => {
    const sessions = db.prepare(
    'SELECT * FROM chat_sessions WHERE user_id = ? ORDER BY created_at DESC'
).all(req.userId);
res.json(sessions);
});

router.patch('/:id', (req, res) => {
    const {title} = req.body;
    db.prepare('UPDATE chat_sessions SET title = ? WHERE id = ? AND user_id = ?').run(title, req.params.id, req.userId);
    res.json({success: true});

});

router.get('/:id/images', (req, res) => {
    db.prepare('DELETE FROM chat_sessions WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
    res.json({success: true});
});

router.get('/:id/images', (req, res) => {
    const images = db.prepare(
        'SELECT * FROM image_generations WHERE sessions_id = ? AND user_id = ? ORDER BY created_at ASC'
    ).all(req.params.id, req.userId);
    res.json(images);

});

module.exports = router;