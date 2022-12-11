const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    online: {
        type: Boolean,
        default: false
    },
    socketId: {
        type: String,
        default: null
    }
});

userSchema.statics.generateHash = function (password) {
    return bcrypt.hash(password, saltRounds);
};

userSchema.statics.validPassword = async function (password, hash) {
    return await bcrypt.compare(password, hash, function(err, result) {
        return result;
    });
};

const User = mongoose.model("User", userSchema);
module.exports = User;