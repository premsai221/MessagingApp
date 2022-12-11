const express = require("express");
const { cookieJWTAuth, socketJWTAuth } = require("../middlewares/cookieJWTAuth");
const { Server } = require("socket.io");
const User = require("../models/User");
const Msgs = require("../models/UserMsgs");

const router = express.Router();

const io = new Server({
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});


io.on("connection", async (socket) => {
    const cookie = socket.handshake.headers.cookie;
    if (cookie) {
        const token = cookie.split("=")[1];
        const username = await socketJWTAuth(token);
        const userObj = await User.findOne({ username: username });
        if (userObj !== undefined) {
            await User.updateOne({ username: userObj.username }, {$set:{ online: true, socketId:socket.id }});
            
            socket.on("new-friend", async (msg) => {
                const friend = await User.findOne({username: msg});
                if (friend !== null)
                {
                    if (friend.online)
                    {
                        io.to(friend.socketId).emit("add-friend", username);
                    }
                    socket.emit("add-friend", friend.username);
                    const msgDoc = new Msgs({
                        firstUser: username,
                        secondUser: friend.username,
                        msgs: []
                    });
                    msgDoc.save();
                }
            })
            
            socket.on("send-msg", async (msg) => {
                const receiver = await User.findOne({username: msg.to});
                if (receiver.username !== undefined)
                {
                    msg.timeSent = new Date();
                    if (receiver.online)
                    {
                        io.to(receiver.socketId).emit("new-msg", msg);
                    }
                    const msgs = await Msgs.findOne({$or:[{firstUser: username, secondUser: receiver.username},
                        {firstUser: receiver.username, secondUser: username}]});
                    msgs.msgs.push(msg);
                    msgs.lastMsg = msg.timeSent;
                    msgs.save();
                }
            })

            socket.on("get-msgs", async (user) => {
                const msgs = await Msgs.findOne({$or:[{firstUser: username, secondUser: user},
                        {firstUser: user, secondUser: username}]});
                const msgObj = {
                    user: user,
                    msgs:msgs.msgs
                };
                socket.emit("user-msgs", msgObj);
            })

            socket.on("disconnect", async () => {
                await User.updateOne({ username: userObj.username }, {$set:{ online: false, socketId:null }});
                console.log("User Disconnected");
            });

            console.log("User Connected");
        }
        else {
            socket.disconnect();
        }
    }
    else {
        socket.disconnect();
    }
});

router.get("/", cookieJWTAuth, async (req, res) => {
    const user = req.user.username;
    const friends = await Msgs.find({$or: [{firstUser: user}, {secondUser: user}]}, {msgs:0}).sort({lastMsg: -1});
    const mappedArray = friends.map((doc) => {
        if (doc.firstUser === user)
        return doc.secondUser;
        else
        return doc.firstUser;
    })
    res.render("chat", {username:user, friends: mappedArray});
});

module.exports.chatRouter = router;
module.exports.io = io;