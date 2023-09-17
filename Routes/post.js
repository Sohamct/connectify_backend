// Assuming you're using Express for routing
const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const { check, body, validationResult } = require('express-validator');
const Post = require('../models/Post')
const multer = require('multer');


router.get('/fetchAllPosts', fetchUser, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../Frontend/connectify/src/component/images');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null, uniqueSuffix + '-'+ file.originalname)
  }
})

const upload = multer({ storage: storage })

router.post('/newPost', fetchUser, upload.single("image") ,async (req, resp) => {

  const {title, description } = req.body;
  console.log("Is it comming here")
  
    console.log(req.body);
    const imageName = req.file.filename
    console.log("id: ", req.user.id)
    try{
      const post = await Post.create({
        title : title,
        description: description,
        image: imageName,
        user: req.user.id
      })
      resp.json({status: "ok"});
    }catch(error){
      resp.json({status: error});
    }
})

router.get("/getPost", fetchUser, async (req, resp) => {
  try{
    const userId = req.user.id;
    console.log(userId)
    await Post.find({user: userId}).then(data => {
      resp.send({status : "ok", data : data});
    })
  }catch(error){
    resp.json({status: error});
  }
})


module.exports = router;
