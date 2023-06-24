const jwt = require('jsonwebtoken');
require('dotenv').config()
const signJwt = process.env.JWT_SIGN;
const fetchData = (req, res, next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send("Enter the valid token for authentication1")
    }
    try{
    const data = jwt.verify(token, signJwt)
    req.user  = data.user1;
    next();
}
catch{
        res.status(401).send("Enter the valid token for authentication1")
    }
    
}
module.exports = fetchData;