const mongoose = require('mongoose')

// Require to don;t get undefined value of env file
require('dotenv').config();
const mongooseUrl = process.env.Mongoose_Url

// Mongoose Connection function
const connectToMongoodb =()=>{
    if(mongoose.connect(mongooseUrl)){
        console.log('Mongoose Connected Successfully')
    }
}
module.exports = connectToMongoodb;