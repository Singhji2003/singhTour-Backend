const express = require('express')
const router = express.Router();
const User = require('../models/User')
require('dotenv').config();
const bcrypt = require("bcrypt")
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const fetchData = require('../middleware/fetchData');
const signJwt = process.env.JWT_SIGN;

// Sign Up endpoint

router.post('/sign-up', [
    // Validating email, username and password
    body('email', 'Enter a Valid Email')
        .isEmail(),
    body('username', 'Name length should be 5 to 20 characters')
        .isLength({ min: 5, max: 20 }),
    body('password', 'Password length should be 8 to 10 characters')
        .isLength({ min: 8, max: 20 })
], async (req, res) => {
    let success = false;
    //Validationg the result of validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success = false
        return res.status(400).json({ success, error: errors.array() })
    }

    // Finding an existing email if not avaibale then only enter the user 

    let user = await User.findOne({ email: req.body.email })
    if (user) {
        success = false;
        return res.status(400).json({ success, error: "Email Exists" })
    }
    // If not email exists then enter the user will enter in database
    // Hashing the password to security 
    const salt = await bcrypt.genSalt(10);
    const hashpswd = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashpswd
    })
    const data = {
        user1: {
            id: user.id
        }
    }
    var token = jwt.sign(data, signJwt);
    success = true
    res.send({ success, token })
})

// Login Endpoint
router.post('/login', [
    // Validating email, username and password
    body('email', 'Enter a Valid Email').isEmail(),
    body('password', "Password can't be blank").exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success = false
        return res.status(400).json({ success, errors: errors.array() })
    }
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        success = false
        return res.status(400).json({ success, error: "Login with valid Email, and Password" })
    }
    try {
        const compare = await bcrypt.compare(password, user.password);
        if (!compare) {
            success = false;
            return res.status(400).json({ success, error: "Login with valid Email, and Password" })
        }
        const data = {
            user1: {
                id: user.id
            }
        }
        var token = jwt.sign(data, signJwt);
        success = true;
        res.send({ success, token })
    }
    catch {
        res.send("Some Error Occured")
    }
})

// EndPoint of fetch user
router.get('/fetch-user', fetchData, async (req, res) => {
    const id = req.user.id
    const userData = await User.findById(id).select("-password")
    res.json(userData)
})

module.exports = router;