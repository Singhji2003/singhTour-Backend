const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact')
router.post('/', [
    body('email', 'Enter Valid Email')
        .isEmail(),
    body('name', 'Name length should be at least 2 characters')
        .isLength({ min: 2}),
    body('number', 'Mobile number should contains 10 digits')
        .isLength({ min: 10, max: 10 }),
    body('msg', 'Name length should be at least 5 characters')
        .isLength({ min: 5}),
], async(req, res) => {
    const {email} = req.body
        let success = false;
    try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.json({success, errors})
    }
    const contcatexists = await Contact.findOne({email});
    if(contcatexists){
        success = false;
        return res.json({success, err: "Already exists email"})
    }
       const contact = await Contact.create({
            name: req.body.name,
            email: req.body.email,
            number: req.body.number,
            subject: req.body.subject,
            msg: req.body.msg,
        })
        success = true;
        res.json({success, contact})
       } catch(errors){
        console.log({errors})
       }
})
module.exports = router;