const mongoose = require("mongoose");

const userMsgsSchema = new mongoose.Schema({
    firstUser: String,
    secondUser: String,
    lastMsg : Date,
    msgs: [Object]
})

/* 
 Where msgs is of the format
 {
    from,
    to,
    msg,
    timeSent
 }
*/

const Msgs = mongoose.model("Message", userMsgsSchema);

module.exports = Msgs;