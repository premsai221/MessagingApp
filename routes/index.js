const express = require("express");
const User = require("../models/User");
const jwt =  require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

router.get('/', function (req, res) {
    res.render("index", { page: "index" });
});

router.get("/login", (req, res) => {
    res.render("login", { page: "login" });
});

router.post("/login", (req, res) => {
    console.log(req.body.username);
    console.log(req.body.password);
    res.redirect('/login');
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
        console.log(pass);
        const newUser = new User({username: name, email:email, password:pass})
        const token = jwt.sign({username:name}, process.env.TOKEN_SECRET, { expiresIn: "1h" });
        await newUser.save();
        res.cookie("token", token, {
            httpOnly:true,
            secure:true,
            // signed:true
        });
        res.redirect("/chat");
    }
});



module.exports = router;