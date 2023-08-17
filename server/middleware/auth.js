const jwt = require("jsonwebtoken");
const userModel = require("../models/Users.model");
const secretKey = process.env.SECRET_KEY;

const auth = async(req,res,next) => {
    try{
        const token = req.headers.authorization;
        const verifyToken = jwt.verify(token,secretKey);
        const rootUser = await userModel.findOne({_id:verifyToken._id});
        if(!rootUser){throw new Error("User not found.")}
        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id;

        next();
    }catch(error){
        res.status(500).json({status:500,message:"Unauthorized, no token provided."});
    }
}

module.exports = auth