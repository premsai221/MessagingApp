const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    // online: Boolean,
    socketId: {
        type: mongoose.ObjectId,
        default: undefined
    }
});

userSchema.statics.generateHash = function (password) {
    return bcrypt.hash(password, saltRounds);
};

userSchema.statics.validPassword = function (password) {
    return bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
        return result;
    });
};

const User = mongoose.model("User", userSchema);
module.exports = User;