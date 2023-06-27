const express = require('express')
const router = express.Router();
const User = require('../models/User')
require('dotenv').config();
const bcrypt = require("bcrypt")
const { body, validationResult } = require('express-validator');
var nodemailer = require('nodemailer');
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
        return res.status(400).json({ success, error: 'Wrong email' })
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


// Endpoint forforget password
router.post('/forget-password', async(req, res)=>{
    const {email} = req.body;
    try {
        // Finding email that exists or not
        const user = await User.findOne({email})
        if(!user){
            success = false;
            return res.status(400).json({success, error:"This email doesn't exists"})
        }
        const secret = signJwt + user.password;
        const token = jwt.sign({email:user.email, id: user._id}, secret, {expiresIn:'5m'})
        const link = `https://singh-tour.onrender.com/reset-password/${user._id}/${token}`;
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'thejsorigin@gmail.com',
              pass: process.env.password
            }
          });
          
          var mailOptions = {
            from: 'thejsorigin@gmail.com',
            to: email,
            subject: 'Resest Password of Singh Tour',
            text: link,
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              success = false;
              res.status(200).json({success, error: "Email Not found"})
            } else {
              console.log('Email sent: ' + info.response);
            }});
            success = true;
            res.send({success, msg:'A link has been sent to your Registered Email'})
        }
     catch (error) {
        console.log({err: error})
    }
})
// End point of given link through email
router.get('/reset-password/:id/:token', async(req,res)=>{
    const {id, token} = req.params;
    try{
    const user = await User.findOne({_id: id});
    if(!user){
        return res.status(400).json({success, error:"This email doesn't exists"})
    }
    // const secret = signJwt + user.password;
    // const verify = jwt.verify(token, secret);
    //     if(!verify){
    //         return res.status(400).json("Not verified")
    //     }
        res.render("main", { status : 'not verified'})
        
    }
    catch(error){
        console.log({err: error})

    }
})

// For getting new password
router.post('/reset-password/:id/:token', async(req,res)=>{
    const {id} = req.params;
    const {password} = await req.body;
    try{
    const user = await User.findOne({_id: id});
    if(!user){
        return res.status(400).json({success, error:"This email doesn't exists"})
    }
        const salt = await bcrypt.genSalt(10);
        const hashpswd = await bcrypt.hash(password, salt);
       await User.updateOne({
        _id:id,
       },{
        $set:{
            password: hashpswd,
        },
       })
       res.render("main", { status: 'verified'})

    }
    catch(error){
        console.log({err: error})

    }
})

module.exports = router;