const  mongoose = require('mongoose');
const { Schema } = mongoose;
const PersoanlDetails = new Schema({
  name:{
    type:String
  },
  number:{
    type: Number
  },
  gender:{
    type: String
  },
  email:{
    type:String
  },
  address:{
    type:String
  },
  place:{
    type:String
  },
  member:{
    type:Number
  },
  altnumber:{
    type:Number
  }
});
module.exports = mongoose.model('PersoanlDetails', PersoanlDetails);