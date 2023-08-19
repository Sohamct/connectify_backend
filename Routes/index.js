const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors')
connectToMongo();
const port = 5500;

const app = express();
 
app.use(cors())
 

app.use(express.json()); //inorder to use req.body : we required middleware.

app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));


app.listen(port, () => {
    console.log(`iNotebook backend listening at http://localhost:${port}`);
});
