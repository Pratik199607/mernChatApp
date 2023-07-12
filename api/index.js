const express = require('express');
const db = require('./db');
const dotenv = require('dotenv');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const cors = require('cors');
dotenv.config();
const app = express();
const jwtSecret = process.env.JWT_SECRET

app.use(express.json());

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: 'Content-Type',
    credentials: true,
}))
// app.use(cors());

app.get('/test', (req, res) => {
    res.json('test ok');
    console.log('gwh');
});
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const createdUser=await User.create({ username, password });
        const token = jwt.sign({ userId: createdUser._id,username }, jwtSecret, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).status(201).json({
                id: createdUser._id,
            })
        });
        console.log(token)
    } catch (err) {
        if (err) throw err;
        res.status(500).json('Something went  wrong');
    }
    
});
app.listen(4000);