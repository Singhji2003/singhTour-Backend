const  mongoose = require('mongoose');
const { Schema } = mongoose;
const contactDetails = new Schema({
  name:{
    type:String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  number:{
    type: Number
  },
  subject:{
    type:String
  },
  msg:{
    type:String,
    required:true
  },
  date:{
    type:Date,
    default:Date.now
  }
});
module.exports = mongoose.model('contactDetails', contactDetails);