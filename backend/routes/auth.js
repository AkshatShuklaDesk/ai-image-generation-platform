const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');;

const router = express.Router();

router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    if(!username || !email || !password) {
        return res.status(400).json({error: "All fields is required!"});
    }

    try{
        const hashed = bcrypt.hashSync(password, 10);
        const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
        const info = stmt.run(username, email, hashed);
        const token = jwt.sign({id: info.lastInsertRowid }, process.env.JWT_SECRET, { expiresIN: '7d'});
    } catch (err){
       res.json(400).json({ error: 'Username or email already exists'});
    }
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM usersWHERE email = ?').get(email);
    if(!user || !bcrypt.compareSync(password, user.password)){
       return res.status(401).json({error: 'Invalid credentials'});
    }
    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '7d'});
    res.json({ token, user: { id: user.id, username: user.username, email: user.email}});

});

module.exports = router;
