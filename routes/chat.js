const express = require("express");
const cookieJWTAuth = require("../middlewares/cookieJWTAuth");
const { Server } = require("socket.io");
const User = require("../models/User");
const Msgs = require("../models/UserMsgs");

const router = express.Router();

router.get("/", cookieJWTAuth, (req, res) =>{
    res.render("chat");
});

router.post("/userchat", cookieJWTAuth, (req, res) =>{
    
});

module.exports = router;