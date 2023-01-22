const express = require('express')
const nodemailer = require("nodemailer")
const { MongoClient } = require('mongodb')
const mongoose = require("mongoose")
const User = require("../models/userModel")
const { createMongoDBConnection } = require("../initMongoDBConnection")
const router = express.Router()

const jwt = require("jsonwebtoken")
const crypto = require("crypto")
//const { type } = require('os')

mongoose.set("strictQuery", false)

router.post('/signup', async (req, res) => {
    let { password, email, name } = req.body
    const salt = crypto.randomBytes(32).toString("base64")
    const hashedPassword = crypto.createHmac("sha512", salt).update(password).digest("hex")
    const token = jwt.sign({ email: email, }, process.env.JWT_SECRET, { expiresIn: "1h" })

    mongoose.connect(process.env.MONGODB_URL, {
        dbName: "kahootv2"
    })
    if (!(password || email || name)) {
        return res.status(400).send("All input are required")
    }
    const oldUser = User.findOne({ email: email })
    if (oldUser) {
        return res.status(409).send("User already exists. Please login")
    }

    const transporter = nodemailer.createTransport({
        port: 465,
        host: "Smtp.gmail.com",
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })
    const confirmEmailUrl = `${"http://localhost:8080" || req.hostname}/confirm/${token}`
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Confirm Your Email Address",
        html: `Please click this link to confirm your email: <a href="${confirmEmailUrl}"> ${confirmEmailUrl} </a>. The link expires in 1 hour.`
    };
    try {

        const user = new User({
            ...req.body,
            password: hashedPassword + salt,
            confirmationToken: token,
            isVerified: false
        })
        await user.save()

        await transporter.sendMail(mailOptions);
        console.log("Mail sent");
        res.status(200).send("Sign up success")
    }
    catch (err) {
        console.log(err)
        res.redirect("signup")
    }
})

router.post("/login", async (req, res) => {
    let { email, password } = req.body
 
    try {
        mongoose.connect(process.env.MONGODB_URL, {
            dbName: "kahootv2"
        })
        if (!(email || password)) {
            return res.status(400).send("All inputs are required")
        }
        const user = await User.findOne({ email: email })
        console.log(user)
        if (!user) {
            return res.status(404).send("User does not exist")
        }
        else if (!user.isVerified) {
            return res.status(401).send("Please confirm you email adress before login")
        }
        const salt = user.password.slice(-44)
        const newHashedPassword = crypto.createHmac("sha512", salt).update(password).digest("hex") + salt
        console.log(`newHashedPassword equal to database password: ${newHashedPassword === user.password}`)
        if (!(newHashedPassword === user.password)) {
            return res.status(400).send("Password incorrect")
        } else {
            const authToken = jwt.sign({userId:user._id, email: user.email},process.env.JWT_SECRET)
            user.authToken = authToken
            await user.save
            res.header("Auth", authToken)
            res.status(200).send("Login success")
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
})

module.exports = router