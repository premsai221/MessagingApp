const mongoose = require("mongoose");

const userMsgsSchema = new mongoose.Schema({
    firstUser: String,
    secondUser: String,
    msgs: [Object]
})

const Msgs = mongoose.model("Message", userMsgsSchema);

module.exports = Msgs;