const express = require('express');
const Follower = require('../models/Follower');
const router = express.Router();
const { check, body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');
const moment = require('moment');

router.post('/getFollowers', fetchUser, async (req, resp) => {
    let success = false;
    try{

        let followers = await Follower.find({ following: req.user.id });
        resp.send({followers: followers});

    }catch(err){
        resp.send({error: err})
    }
})

router.post('/getFollowing', fetchUser, async (req, resp) => {
    let success = false;
    try{

        let followings = await Follower.find({ follower: req.user.id });
        success = true;
        resp.send({success: success, followings: followings});

    }catch(err){
        resp.send({success: success,  error: err})
    }
})

router.post('/getNonMutualFollowers', fetchUser, async (req, resp) => {
    try {
        // Get the users who follow the authenticated user
        const followers = await Follower.find({ following: req.user.id });

        // Get the users whom the authenticated user follows
        const following = await Follower.find({ follower: req.user.id });

        // Extract the user IDs from both lists
        const followerIds = followers.map(follower => follower.follower.toString());
        const followingIds = following.map(following => following.following.toString());

        // Find the users who do not appear in both lists
        const nonMutualFollowers = followers.filter(follower => !followingIds.includes(follower.follower.toString()));
        const nonMutualFollowing = following.filter(following => !followerIds.includes(following.following.toString()));

        resp.send({
            success: true,
            nonMutualFollowers: nonMutualFollowers,
            nonMutualFollowing: nonMutualFollowing
        });
    } catch (err) {
        resp.send({ success: false, error: err });
    }
});


module.exports = router;