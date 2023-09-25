const express = require('express');
const Follower = require('../models/Follower');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const moment = require('moment');
const User = require('../models/User');

router.post('/getFollowers', fetchUser, async (req, resp) => {
  try{
      console.log("getting Followers")
      const followers = await Follower.find({ following: req.user.id, status: true });
      const followersIds = followers.map((data) => data.follower.toString());

    console.log(followersIds);

      const followings = await Follower.find({ follower: req.user.id, status: true });
      const followingsIds = followings.map((data) => data.following.toString());
      console.log(followingsIds);
      const commonIds = followersIds.filter(id => followingsIds.includes(id));
      const commonUsers = await User.find(
        {_id : {$in : commonIds}}
      );


      const requested = await Follower.find({ follower: req.user.id, status: false });
      const requestedIds = requested.map((data) => data.following.toString());
      const commonRequestedIds = requestedIds.filter((id) => followersIds.includes(id));
      const commonRequestedUsers = await User.find(
        {_id : {$in : commonRequestedIds}}
      );

      let list = followersIds.filter(id => !followingsIds.includes(id))
      list = list.filter(id => !commonIds.includes(id))
      const onlyFollowers = await User.find({
        _id : {$in : list},
        password: 0
      })


      resp.send({commonUsers: commonUsers, commonRequestedUsers: commonRequestedUsers, onlyFollowers: onlyFollowers});

  }catch(err){
      resp.send({error: err});
  } 
})

// done
router.post('/getRequests', fetchUser, async (req, resp) => {
    try{
        console.log("getting requests")
        const requests = await Follower.find({ following: req.user.id, status: false });
        const requestsIds = requests.map((request) => request.follower.toString());
        const requestUsers = await User.find(
          { _id: { $in: requestsIds } }, // Find users whose _id is in the requestsIds array
          { password: 0 },
        )
        resp.send({requestUsers: requestUsers});

    }catch(err){
        resp.send({error: err});
    } 
})
// done
router.post('/getPendingRequest', fetchUser, async (req, resp) => {
  try{
      console.log("getting requests")
      const pendingRequests = await Follower.find({ follower: req.user.id, status: false });
      const pendingRequestsIds = pendingRequests.map((request) => request.following.toString());
      const pendingRequestsUsers = await User.find(
        { _id: { $in: pendingRequestsIds } }, // Find users whose _id is in the requestsIds array
        { password: 0 },
      )
      resp.send({pendingRequestsUsers: pendingRequestsUsers});

  }catch(err){
      resp.send({error: err});
  } 
})
// done
router.post('/getFollowbacks', fetchUser, async (req, resp) => {
  try {
    const loggedInUserId = req.user.id;
    console.log("console.log(loggedInUserId): ", loggedInUserId)
    const followers = await Follower.find({ following: loggedInUserId, status: true});
    const followersIds = followers.map(follower => follower.follower.toString());
    console.log("followersIds ", followersIds)

    const followings = await Follower.find({ follower: loggedInUserId });
    const followingsIds = followings.map(following => following.following.toString());
    console.log("followingsIds ", followingsIds)
    let followbackIds = followersIds.filter((followerId) => !followingsIds.includes(followerId));
    followbackIds = followbackIds.filter(item => item !== req.user.id);
    const followbackUsers = await User.find({
      _id: {
        $in: [...followbackIds],
      }
    });
    // console.log("Hello");
    // console.log(nonMutualUsers[0].userName);
    resp.send({ success: true, followbackUsers  });
  } catch (err) {
    resp.send({ success: false, error: err.message });
  }
})
// done
router.post('/getFollowings', fetchUser, async (req, resp) => {
    let success = false;
    try{
        console.log("getting followings")
        console.log(req.user.id)
        let followings = await Follower.find({ follower: req.user.id, status: true });
        const followingsIds = followings.map((request) => request.following.toString());
        const followingsUsers = await User.find(
          { _id: { $in: followingsIds } }, // Find users whose _id is in the requestsIds array
          { password: 0 },
        )
        resp.send({success: true, followingsUsers: followingsUsers});

    }catch(err){
        resp.send({success: success,  error: err});
    }
})
// done
router.post('/cancelRequest', fetchUser, async (req, resp) => {
  try {
      const loggedInUserId = req.user.id;
      const toId = req.body.toId;
    console.log("Making request ...");
    console.log(loggedInUserId);
    console.log(toId);
    await Follower.deleteOne(
      { follower: loggedInUserId, following: toId },
    );
      console.log("Canceling request")
      resp.send({ success: true, message: 'Request canceled successfully' });
  } catch (error) {
      resp.send({ success: false, error: error.message });
  }
});

// done
router.post('/denieRequest', fetchUser, async (req, resp) => {
  try {
      const loggedInUserId = req.user.id;
      const toId = req.body.toId;
    console.log("Making request ...");
    console.log(loggedInUserId);
    console.log(toId);
    await Follower.deleteOne(
      { follower: toId, following: loggedInUserId },
    );
      console.log("denieRequest")
      resp.send({ success: true, message: 'Request canceled successfully' });
  } catch (error) {
      resp.send({ success: false, error: error.message });
  }
});


// done
router.post('/makeRequest', fetchUser, async (req, resp) => {
    try {
        const loggedInUserId = req.user.id;
        const toId = req.body.toId;
      console.log("Making request ...");
      console.log(loggedInUserId);
      console.log(toId);
            await Follower.create({
                follower: loggedInUserId,
                following: toId,
                status: false
            });

        resp.send({ success: true, message: 'Request sent successfully' });
    } catch (error) {
        resp.send({ success: false, error: error.message });
    }
});
// done
router.post('/removeFollower', fetchUser, async (req, resp) => {
  const followerId = req.body.toId;
  const followingId = req.user.id;
  console.log("req.body.toId: ", followerId)
  console.log("req.body.toId: ", followingId)
  try{
      console.log("removing follower")
      await Follower.deleteOne({ follower: followerId, following: followingId });

      resp.send({success: true});

  }catch(err){
      resp.send({success: false,  error: err})
  }
})

router.post('/unfollow', fetchUser, async (req, resp) => {
  const followingId = req.body.toId;
  const followerId = req.user.id;
  try{
      console.log("removing follower")
      await Follower.deleteOne({ follower: followerId, following: followingId });

      resp.send({success: true});

  }catch(err){
      resp.send({success: false,  error: err})
  }
})

// done
router.post('/acceptRequest', fetchUser, async (req, resp) => {
    try {
      const followingId = req.user.id;
      const followerId = req.body.toId;
      console.log("req.body.toId ", req.body.toId);
      const updatedFollower = await Follower.updateOne(
        { follower: followerId, following: followingId },
        { $set: { status: true } }
      );
  
      resp.send({ success: true });
    } catch (err) {
      resp.send({ success: false, error: err.message });
    }
  });
  router.post('/makeFollowback', fetchUser, async (req, resp) => {
    try {
      const followerId = req.user.id;
      const followingId = req.body.toId;
      console.log("req.body.toId ", req.body.toId);
      await Follower.create({
        follower: followerId,
        following: followingId,
        status: false
    });
  
      resp.send({ success: true });
    } catch (err) {
      resp.send({ success: false, error: err.message });
    }
  });
  
  
  router.post('/getNonMutualUsers', fetchUser, async (req, resp) => {
    try {
      const loggedInUserId = req.user.id;
  
      const following = await Follower.find({ follower: loggedInUserId });
      const followingIds = following.map(follower => follower.following.toString());
  
      const followers = await Follower.find({ following: loggedInUserId });
      const followerIds = followers.map(follower => follower.follower.toString());
      
      const nonMutualUsers = await User.find({
        _id: {
          $nin: [...followingIds, ...followerIds],
          $ne: loggedInUserId
        }
      });
      // console.log("Hello");
      // console.log(nonMutualUsers[0].userName);
      resp.send({ success: true, nonMutualUsers  });
    } catch (err) {
      resp.send({ success: false, error: err.message });
    }
  });

  router.post('/countFollowers', fetchUser, async(req, resp) => {
    try{
      const followers = await Follower.find({status: true, following: req.user.id});
      const count = followers.length;
      resp.send({status: true, count: count});
    }catch(error){
      resp.send({status: false, error: error});
    }
  })
  
  
  router.post('/countFollowings', fetchUser, async(req, resp) => {
    try{
      const followings = await Follower.find({status: true, follower: req.user.id});
      const count = followings.length;
      resp.send({status: true, count: count});
    }catch(error){
      resp.send({status: false, error: error});
    }
  })

module.exports = router;