const express = require("express")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const router = express.Router()

const User = require("../models/userModel")

router.get("/:confirmationToken", validateToken, async (req, res) => {
    console.log(req.params)
    const token = req.params.confirmationToken
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: "kahootv2"
        })
        mongoose.connection.on("error", err => {
            throw new Error("MongoDB lost connection.")
        })
        const user = await User.findOne({ confirmationToken: req.params.confirmationToken })
        console.log(user, "this is user")
        if (!user) {
            res.status(404).send({ message: "User not found." })
            return
        } else {
            user.isVerified = true
            await user.save()
            return res.status(200).send("User found and isVerified = true.")
        }
    } catch (err) {
        console.log(err)
        res.end()
    }
})

async function validateToken(req, res, next) {
    const token = req.params.confirmationToken
    try {
        let tokenObject = jwt.verify(token, process.env.JWT_SECRET)
        console.log(tokenObject)
        console.log("Token is not expired")
        next()
    } catch (error) {
        console.log(error)
        res.status(404).json({
            message: "Token has expired",
            expired: error.expiredAt
        })
    }
}

module.exports = router