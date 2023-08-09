const connectToMongoodb = require('./db')
const express = require('express');
require('dotenv').config();
const Auth = require('./routes/Auth')
const Contact = require('./routes/Contact')
const PersonalDetails = require('./routes/PersonalDetails');
const cors = require('cors');
connectToMongoodb();
const app = express()
app.use(express.json())
app.use(cors());
app.use(express.urlencoded({extended:false}))
app.set("view engine", "ejs")
const PORT = process.env.PORT

// For Authentication Routes
app.use('/', Auth )
app.use('/contact', Contact )
app.use('/personalDetails', PersonalDetails )

// Running the server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})