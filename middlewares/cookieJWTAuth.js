const jwt =  require("jsonwebtoken");
const User = require("../models/User");

const cookieJWTAuth = async (req, res, next) => {
    const token = req.cookies.token;
    try {
        const username = await jwt.verify(token, process.env.TOKEN_SECRET);
        // console.log(username.username);
        const user = await User.findOne({username:username.username});
        req.user = user;
        next();
    }
    catch (e){
        console.log(e); 
        res.redirect("/login");
    }
}

module.exports = cookieJWTAuth;