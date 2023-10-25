// Assuming you're using Express for routing
const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Post = require('../models/Post')
const multer = require('multer');
const LikePost = require('../models/LikePost');
const User = require('../models/User');


router.get('/fetchAllPosts', fetchUser, async (req, res) => {
  try {
    const posts = await Post.find({});
    // console.log("fetching post");
    // console.log(posts);
    res.send({ posts: posts });
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
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage })

router.post('/newPost', fetchUser, upload.single("image"), async (req, resp) => {

  const { title, description } = req.body;

  // Check if req.file exists
  if (!req.file) {
    return resp.status(400).json({ error: "No file uploaded" });
  }

  const imageName = req.file.filename;

  try {
    const post = await Post.create({
      title: title,
      description: description,
      image: imageName,
      user: req.user.id
    });
    resp.json({ status: "ok" });
  } catch (error) {
    resp.json({ status: error });
  }
})

  router.get('/fetchOwner', fetchUser, async (req, resp) => {
    try{
      const posts = await Post.find({});
      // const postIds = posts.map((p) => p._id.toString());

      const userIds = posts.map((p) => p.user.toString());
      const users = await User.find({_id : {$in: userIds}});

      // const userName = users.map(u => u.userName.toString());

      let map = {};

      posts.forEach(p => {
        for(const u of users){
          if(u._id.toString() == p.user.toString()){
            map[p._id.toString()] = u.userName;
            break;
          }
        }
      })
      // console.log(map);
      resp.json({status: true, map: map});
      
    }catch(error){

    }
  })

router.get("/getPost", fetchUser, async (req, resp) => {
  try {
    const userId = req.user.id;
    // console.log(userId)
    await Post.find({ user: userId }).then(data => {
      resp.send({ status: "ok", data: data });
    })
  } catch (error) {
    resp.json({ status: error });
  }
})

router.post("/deletePost", fetchUser, async (req, resp) => {
  try {
    const userId = req.user.id;
    const postId = req.body.postId;
    // console.log(userId)
    await Post.deleteOne({ _id: postId })
    await LikePost.deleteMany({ post: postId })
    console.log('deleted successfully');
    const posts = await Post.find({ user: userId })
    resp.json({ status: true, posts: posts });
  } catch (error) {
    resp.json({ status: error, error: error });
  }
})

router.post('/likePost', fetchUser, async (req, resp) => {
  try {
    const userId = req.user.id;
    const postId = req.body.postId;
    // // console.log('console.log(userId)', userId)
    // // console.log('console.log(postId)', postId);

    const existUser = await LikePost.findOne({ user: userId, post: postId, status: false });
    if (existUser) {

      // console.log("User has already disliked post")

      await LikePost.updateOne(
        { user: userId, post: postId },
        { $set: { status: true } }
      );

    } else {
      // console.log("User is liking post")
      await LikePost.create({
        user: userId,
        post: postId,
        status: true
      })
    }
    resp.json({ status: true });
  } catch (err) {
    resp.json({ status: err });
  }


})

router.post('/disLikePost', fetchUser, async (req, resp) => {

  try {
    const userId = req.user.id;
    // console.log("disliked by: ", userId)
    const postId = req.body.postId;
    // console.log("dislike", postId);
    const existUser = await LikePost.findOne({ user: userId, post: postId, status: true });
    if (existUser) {

      // console.log("User has already liked post")

      await LikePost.updateOne(
        { user: userId, post: postId },
        { $set: { status: false } }
      );

    } else {
      // console.log("User is Disliking post")
      await LikePost.create({
        user: userId,
        post: postId,
        status: false
      })
    }
    resp.json({ status: true });
  } catch (err) {
    resp.json({ status: err });
  }

})

router.get('/getLikedPost', fetchUser, async (req, resp) => {
  try {
    const userId = req.user.id;
    // console.log("Getting liked post");
    const likedPosts = await LikePost.find({ user: userId, status: true });
    // console.log("outside", likedPosts);
    if (likedPosts.length > 0) {
      const likedPostIds = likedPosts.map(item => item.post.toString());
      // console.log(likedPostIds);
      resp.json({ status: true, LikedPostIds: likedPostIds });
    } else {
      resp.json({ status: false, message: 'No liked posts found.', LikedPostIds: [] });
    }
  } catch (err) {
    resp.json({ status: err });
  }
});

router.get('/countLikedPost', fetchUser, async (req, resp) => {
  try {
    console.log("Getting count liked post");
    const posts = await Post.find({});
    // console.log("count liked", posts.post)
    const postIds = posts.map((p) => p._id.toString());
    // console.log("postids ", postIds);
    const likedPost = await LikePost.find({ status: true });

    const likedPostIds = likedPost.map((lp) => lp.post.toString());
    // console.log("likedPostIds", likedPostIds);
    let mp = {};

    postIds.forEach(pId => {
      likedPostIds.forEach(lpId => {
        if (lpId === pId) {
          if (mp[pId] === undefined) {
            mp[pId] = 0;
          }
          mp[pId]++;
        }
      })
    });

    resp.json({ status: true, mp: mp })
  } catch (err) {
    resp.json({ status: err });
  }
});


router.get('/countDislikedPost', fetchUser, async (req, resp) => {
  try {
    // console.log("Getting count liked post");
    const posts = await Post.find({});
    // console.log("count liked", posts.post)
    const postIds = posts.map((p) => p._id.toString());
    // console.log("postids ", postIds);
    const dislikedPost = await LikePost.find({ status: false });

    const dislikedPostIds = dislikedPost.map((dlp) => dlp.post.toString());
    // console.log("likedPostIds", likedPostIds);
    let mp = {};

    postIds.forEach(pId => {
      dislikedPostIds.forEach(dlpId => {
        if (dlpId === pId) {
          if (mp[pId] === undefined) {
            mp[pId] = 0;
          }
          mp[pId]++;
        }
      })
    });

    resp.json({ status: true, mp: mp })
  } catch (err) {
    resp.json({ status: err });
  }
});

router.get('/getDislikedPost', fetchUser, async (req, resp) => {
  try {
    const userId = req.user.id;
    // console.log("Getting disliked post");
    const DislikedPost = await LikePost.find({ user: userId, status: false });
    // console.log(DislikedPost);
    if (DislikedPost) { // Check if DislikedPost exists
      // console.log("inside if", DislikedPost);
      const DislikedPostIds = DislikedPost.map(item => item.post.toString());
      // console.log("id: ", DislikedPostIds);
      resp.json({ status: true, DislikedPostIds: DislikedPostIds });
    } else {
      // console.log("why failed");
      resp.json({ status: false, message: 'No disliked posts found.', DislikedPostIds: [] });
    }
  } catch (err) {
    resp.json({ status: err });
  }
});

router.post('/remove', fetchUser, async (req, resp) => {

  try {
    const userId = req.user.id;
    const postId = req.body.postId;
    // console.log("remove remove remove remove remove remove remove remove", postId);
    await LikePost.deleteOne({ user: userId, post: postId });

    resp.json({ status: true });
  } catch (err) {
    resp.json({ status: err });
  }
})

router.post('/getLikedUsers', fetchUser, async(req, resp) => {
  try{
    const postId = req.body.postId;
    // console.log(req.user.id);
    // console.log(postId);
    const LikedPosts = await LikePost.find({post: postId, status: true});
    const likedUserIds = LikedPosts.map(lp => lp.user.toString());
    const likedPostUsers = await User.find({_id : {$in : likedUserIds}}, {password: 0});
    // console.log("likedPostUsers", likedPostUsers);
    resp.send({status: true, likedPostUsers: likedPostUsers});
  }catch(error){
    resp.send({status: false});
  }
})


module.exports = router;
