const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { check, body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');
const moment = require('moment');


const JWT_SECRET = 'SohamIsagood$bOY';
//ROUTE 1 : Create a User using : POST "/api/auth/createuser". Doesn't require auth.

router.post('/createuser', [
    check('userName')
        .trim().notEmpty().withMessage('Username cannot be empty')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email', 'Enter a valid email address').isEmail(),
    body('firstName', 'Enter a valid name.').isLength({ min: 2 }),
    body('lastName', 'Enter a valid name.').isLength({ min: 2 }),
    body('password', 'Password must be atleast of 5 characters').isLength({ min: 5 }),
    body('gender', 'Enter a valid gender').isIn(['male', 'female', 'other']),
    body('dob', 'Enter a valid date of birth')
], async (req, resp) => {
    console.log("API IS CALLING");
    let success = false;
    // if there are errors, return Nad request and the errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("error after validating data ...");
        return resp.status(400).json({ errors: errors.array() });
    }

    let user = await User.findOne({ email: req.body.email });
    let user2 = await User.findOne({ userName: req.body.userName });

    //check whether email exist already
    try {
        if (user) {
            console.log("A user with this email has been already registered!");
            return resp.status(400).json({ success, errors: "A user with this email has been already registered!" });
        }
        if (user2) {
            console.log("A user with this username has been already registered!");
            return resp.status(400).json({ success, errors: "A user with this UserName has been already registered!" });
        }
        //creat a new user
        try {
            const salt = await bcrypt.genSalt(10)
            const securedPassword = await bcrypt.hash(req.body.password, salt);
            const dobMoment = moment(req.body.dob, 'YYYY-MM-DD');
            const age = moment().diff(dobMoment, 'years');
            console.log("Processing thr age...")

            user = await User.create({
                userName: req.body.userName,
                firstName: req.body.firstName,
                password: securedPassword,
                email: req.body.email,
                lastName: req.body.lastName,
                gender: req.body.gender,
                dob: req.body.dob,
                age: age
            });
            const data = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);
            console.log(authtoken);

            // resp.json(user);
            success = true;
            console.log("success fully registered")
            resp.json({ success, authtoken })
        } catch (error) {
            console.log(error.message);
            resp.status(500).send("Unexpected error occured");
        }
    } catch (error) {
        console.log(error.message);
        resp.status(500).send("Unexpected error occurred");
    }


    // .then(user => resp.json(user))
    // .catch(error => {resp.json({error : "Entered Email Address is already registered!", message : error.message})});

})


// //ROUTE 2 : Login
router.post('/login', [
    check('userName')
        .trim().notEmpty().withMessage('Username cannot be empty')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('password', 'Password can not be blank').exists(),
], async (req, resp) => {

    let success = false;

    // if there are errors, return Nad request and the errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return resp.status(400).json({ errors: errors.array() });
    }

    const { userName, password } = req.body;

    try {
        let user = await User.findOne({ userName });
        if (!user) {
            return resp.status(400).json({success, error: "Please try login with correct Credentials." });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return resp.status(400).json({ success, error: "Please try login with correct Credentials." });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        console.log("Logged in");
        resp.json({ success, authtoken });
    } catch (error) {
        console.log(error.message);
        resp.status(500).send("Internal Server Error");
    }
})


// //ROUTE 3 : get logged in user detail POST:  /api/auth.getuser  Login Required

router.post('/getUsers', fetchUser, async (req, resp) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        resp.send(user);
    } catch (error) {
        console.log(error.message);
        resp.status(500).send("Internal Server Error");
    }
})

router.get('/validateUser', fetchUser, async (req, resp) => {
    try{
        
        if(req.user.id){
            console.log('validated')
            return resp.json({status: true});
        }else{
            return resp.json({status: false});
        }
    }catch(err){
        return resp.json({status: false, error: err});
    }
})
module.exports = router;