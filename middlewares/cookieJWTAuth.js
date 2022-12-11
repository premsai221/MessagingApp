const jwt =  require("jsonwebtoken");
const User = require("../models/User");

const cookieJWTAuth = async (req, res, next) => {
    const token = req.cookies.token;
    try {
        const username = await jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findOne({username:username.username});
        req.user = user;
        next();
    }
    catch (e){
        // console.log(e); 
        res.redirect("/login");
    }
}

const socketJWTAuth = async (token) => {
    const username = await jwt.verify(token, process.env.TOKEN_SECRET);
    return username.username;
} 

module.exports.cookieJWTAuth = cookieJWTAuth;
module.exports.socketJWTAuth = socketJWTAuth;