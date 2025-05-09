require("dotenv").config({path:"../../.env"});
const jwt = require("jsonwebtoken");
 
function generateToken(user){
  return jwt.sign({id: user.id, username: user.username,},  process.env.JWT_SECRET,{
    expiresIn:"30d"// token expires in 30 days 
  });
}

function verifyToken(req, res, next){
  const bearerHeader = req.headers["authorization"];

  if(!bearerHeader){
    return res.status(403).json({error: "Access forbidden. No token provided"});
  }

  const bearer = bearerHeader.split(" ");//[bearer, token]
  const bearerToken = bearer[1];//get token

  if(bearerToken){
    jwt.verify(bearerToken, process.env.JWT_SECRET,(err,decoded) => {
      if(err){
        return res.status(403).json({error: "Invalid token"});
      }
      req.user=decoded;
      next()
    });
  }else{
    return res.status(403).json({error: "Access forbidden. Token missing"})
  }
}

module.exports ={generateToken, verifyToken}