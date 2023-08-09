const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchData = require('../middleware/fetchData');
const PersonalDetails = require('../models/PersonalDetails');
// fetch the details
router.get('/fetchDetails', fetchData, async (req, res) => {
   const details = await PersonalDetails.find({ user: req.user.id })
   res.json(details)
})
router.post('/addDetails', fetchData, async (req, res) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.json({ success, errors })
      }
      const persoanlDetails = await PersonalDetails.create({
         user: req.user.id,
         name: req.body.name,
         number: req.body.number,
         gender: req.body.gender,
         email: req.body.email,
         address: req.body.address,
         place: req.body.place,
         member: req.body.member,
         altnumber: req.body.altnumber,
      })
      success = true;
      res.json({ success, persoanlDetails })
   } catch (errors) {
      console.log({ errors })
   }
})
module.exports = router;