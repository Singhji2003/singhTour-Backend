const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const PersoanlDetails = require('../models/PersonalDetails')
router.post('/', async(req, res) => {
    try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.json({success, errors})
    }
       const PersonalDetails = await PersoanlDetails.create({
            name: req.body.name,
            number: req.body.number,
            gender: req.body.gender,
            email: req.body.email,
            address: req.body.address,
            place: req.body.place,
            member: req.body.member,
            altnumber : req.body.altnumber ,
        })
        success = true;
        res.json({success, PersonalDetails})
       } catch(errors){
        console.log({errors})
       }
})
module.exports = router;