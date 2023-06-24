const mongoose = require('mongoose')

// Require to don;t get undefined value of env file
const mongooseUrl = 'mongodb+srv://arpansinghrajput123:Arpan123@userdetails.jbkukmy.mongodb.net/';

// Mongoose Connection function
const connectToMongoodb =()=>{
    if(mongoose.connect(mongooseUrl)){
        console.log('Mongoose Connected Successfully')
    }
}
module.exports = connectToMongoodb;