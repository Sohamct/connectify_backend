// Assuming you're using Express for routing
const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const { check, body, validationResult } = require('express-validator');

router.get('/fetchAllPosts', fetchUser, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/addPost', fetchUser, [
  body('title', 'Title can not be empty!').isLength({min : 1}),
  body('description', 'Description can not be empty!').isLength({min : 1}),
],async(req, resp) => {
  try{
      const errors = validationResult(req);

  // id there are errors, return bad request and the errors
  if(!errors.isEmpty()){
      return resp.status(400).json({errors : errors.array()});
  }
  const {title, description, tag, date} = req.body;

  const note = new Notes({title, description, tag, date, user : req.user.id});
  const savedNote = await note.save()
  resp.send(savedNote);
  }catch(error){
      console.log(error.message);
      resp.status(500).send("Internal Server Error");
  }
})


module.exports = router;
