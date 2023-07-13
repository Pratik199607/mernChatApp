const express = require('express');
const db = require('./db');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const ws = require('ws');
dotenv.config();
const app = express();
const jwtSecret = process.env.JWT_SECRET;
const salt = bcrypt.genSaltSync(10);

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: 'Content-Type',
    credentials: true,
  })
);

app.get('/test', (req, res) => {
  res.json('test ok');
  console.log('gwh');
});

app.get('/profile', (req, res) => {
  const token = req.cookies?.token;
//   console.log("Token :",token)
  if (token) {
    jwt.verify(token, jwtSecret, (err, userData) => {
      if (err) throw err;
      const { id, username } = userData;
      res.json(userData);
    });
  } else {
    res.status(401).json('no token');
  }
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(409).json({ message: 'username already exists' });
  }

  try {
    const hashedPass = bcrypt.hashSync(password, salt);
    const createdUser = await User.create({
      username,
      password: hashedPass,
    });
    const token = jwt.sign(
      { userId: createdUser._id, username },
      jwtSecret,
      (err, token) => {
        if (err) throw err;
        res
          .cookie('token', token, { sameSite: 'none', secure: true })
          .status(201)
          .json({
            id: createdUser._id,
            username,
          });
      }
    );
    console.log(token);
  } catch (err) {
    if (err) throw err;
    res.status(500).json('Something went wrong');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });
  if (foundUser) {
    const passOk = bcrypt.compare(password, foundUser.password);
    if (passOk) {
      jwt.sign({ userId: foundUser._id, username }, jwtSecret, (err, token) => {
        res
          .cookie('token', token, { sameSite: 'none', secure: true })
          .status(201)
          .json({
            id: foundUser._id,
          });
      });
      console.log("Login Success")
    }
  }
});

app.post('/logout', (req, res) => {
  res.cookie('token', '', { sameSite: 'none', secure: true }).json('ok');
});

const server = app.listen(4000);

const wss = new ws.WebSocketServer({ server });
wss.on('connection', (connection, request) => {
  console.log('connected');
  const cookies = request.headers.cookie;
  console.log("Cookie: ",cookies);
  if (cookies) {
    const tokenCookieStr = cookies.split(';').find(str => str.trim().startsWith('token='));
    if (tokenCookieStr) {
        const token = tokenCookieStr.split('=')[1];
        if (token) {
            jwt.verify(token, jwtSecret, (err, userData) => {
                if (err) throw err;
                const { userId, username } = userData;
                console.log(userData);
                connection.userId = userId;
                connection.username = username;
            });
        }
    }
  }

[...wss.clients].forEach(client => {
      client.send(JSON.stringify({
        online: [...wss.clients].map(c => ({userId:c.userId,username:c.username})),
      }));
});

});

// wss.on("close", (conn) => {
//     console.log( 'disconnected');
// }) -> getting undefined while printing the cookie in the above code, please find the issue and fix it
