const mongoose = require("mongoose");

const friendsSchema = new mongoose.Schema({
    username: String,
    friends: [Object]
})

/* 
 Where friends is of the format
 {
    friend-name,
    last-msg
 }
*/

const Frnd = mongoose.model("Friend", friendsSchema);

module.exports = Frnd;