const mongoose = require('mongoose')
require('dotenv').config();
// Require to don;t get undefined value of env file
const mongooseUrl = process.env.Mongoose_Url;

// Mongoose Connection function
const connectToMongoodb =()=>{
    if(mongoose.connect(mongooseUrl)){
        console.log('Mongoose Connected Successfully')
    }
}
module.exports = connectToMongoodb;