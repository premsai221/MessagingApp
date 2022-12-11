const express = require("express");
const { cookieJWTAuth, socketJWTAuth } = require("../middlewares/cookieJWTAuth");
const User = require("../models/User");
const Frnd = require("../models/Friends");
const jwt =  require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

router.get('/',function (req, res) {
    res.render("index", { page: "index" });
});

router.get("/login", (req, res) => {
    res.render("login", { page: "login" });
});

router.post("/login", async (req, res) => {
    if (req.body.username && req.body.password)
    {
        const user = await User.findOne({username:req.body.username});
        if (user && !(user.online) && User.validPassword(req.body.password, user.password))
        {
            const token = jwt.sign({username:user.username}, process.env.TOKEN_SECRET, { expiresIn: "1h" });
            res.cookie("token", token, {
                httpOnly:true,
                secure:true,
                // signed:true
            });
            res.redirect("/chat");
        }
        else{
            res.redirect('/login');
        }
    }
    else{
        res.redirect('/login');
    }
});

router.get("/signup", (req, res) => {
    res.render("signup", { page: "signup" });
});

router.post("/signup", async (req, res) => {
    const name = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const rePassword = req.body.repassword;

    const user = await User.findOne({ username: name });
    const user_email = await User.findOne({ email: email });

    if (user) {
        res.redirect('/signup');
    }
    else if (user_email)
    {
        res.redirect('/signup');
    }
    else if (password !== rePassword)
    {
        res.redirect('/signup');
    }
    else if (name && email && rePassword && password)
    {
        const pass = await User.generateHash(password);
        const newUser = new User({username: name, email:email, password:pass, online:true})
        const frndList = new Frnd({username: name, friends:[]});
        const token = jwt.sign({username:name}, process.env.TOKEN_SECRET, { expiresIn: "1h" });
        await newUser.save();
        await frndList.save();
        res.cookie("token", token, {
            httpOnly:true,
            secure:true,
            // signed:true
        });
        res.redirect("/chat");
    }
});

router.get("/logout", cookieJWTAuth, async (req, res) => {
    res.clearCookie("token");
    res.send("<h2>Thank You</h2>")
});

module.exports = router;