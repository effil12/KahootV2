const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
        lowercase: true,
        unique: true
    },
    password: {
        required: true,
        type: String,
    },
    confirmationToken: {
        type: String,
        unique: true
    },
    isVerified: {
        type: Boolean
    }
})

const User = mongoose.model("users", UserSchema)

module.exports = User