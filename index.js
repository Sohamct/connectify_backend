const Comment = require('./models/Comment');
const Message = require('./models/Message');
const Group = require('./models/Group');
const Notification = require('./models/Notification');
const Post = require('./models/Post');
const User = require('./models/User');
const GroupMessage = require('./models/GroupMessage');
const LikePost = require('./models/LikePost');
const CommentLike = require('./models/CommentLike');
const Follower = require('./models/Follower');
const cors = require('cors'); 
const fetchUser = require('./middleware/fetchUser');
const connectToMongo = require('./db');
const express = require('express');

connectToMongo();

const app = express();
app.use(express.json()); 

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  }));

app.use('/api/auth', require('./Routes/auth'))
app.use('/api/post', require('./Routes/post'))
app.use('/api/folk', require('./Routes/folk'))
// app.use('/api/message', require('./Routes/message'))

app.get('/', (req, res) => {
    res.send('Hello World!')
    console.log("Hello ...");
})
app.listen(5500);