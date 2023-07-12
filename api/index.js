const express = require('express');
const db = require('./db');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs');
dotenv.config();
const app = express();
const jwtSecret = process.env.JWT_SECRET
const salt = bcrypt.genSaltSync(10);

app.use(express.json());
app.use(cookieParser());

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

app.get('/profile', (req, res) => {
    // const { token } = req.cookies;
    const token = req.cookies?.token;
    if (token) {
        jwt.verify(token, jwtSecret, (err, userData) => {
            if (err) throw err;
            const { id, username } = userData;
            res.json(userData);
        });
    } else {
        res.status(401).json('no token')
    }

    
});

app.post('/register', async (req, res) => {
    // const hashedPass = bcrypt.hashSync(password, salt);
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'username already exists' });
    }

    try {
        const hashedPass = bcrypt.hashSync(password, salt);
        const createdUser = await User.create({
            username,
            password:hashedPass
        });
        const token = jwt.sign({ userId: createdUser._id,username }, jwtSecret, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
                id: createdUser._id,
                username,
            });
        });
        console.log(token)
    } catch (err) {
        if (err) throw err;
        res.status(500).json('Something went  wrong');
    }
    
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findOne({ username });
    if (foundUser) {
        const passOk = bcrypt.compare(password, foundUser.password);
        if (passOk) {
            jwt.sign({ userId: foundUser._id, username }, jwtSecret, (err, token) => {
                res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
                    id: foundUser._id,
                });
            });
        }
    }
});

app.post('/logout', (req, res) => {
    res.cookie('token', '', { sameSite: 'none', secure: true }).json('ok');
});
app.listen(4000);