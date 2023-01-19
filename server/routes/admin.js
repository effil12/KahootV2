const express = require('express')
const nodemailer = require("nodemailer")
const { MongoClient } = require('mongodb')
const mongoose = require("mongoose")
const User = require("../models/userModel")
const router = express.Router()

const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const { type } = require('os')

mongoose.set("strictQuery", false)

router.post('/signup', async (req, res) => {
    console.log(req.body)
    let { password, email, name} = req.body
    const salt = crypto.randomBytes(32).toString("base64")
    console.log(salt, salt.length)
    const hashedPassword = crypto.createHmac("sha512", salt).update(password).digest("hex")
    console.log(hashedPassword, hashedPassword.length)
    const token = jwt.sign({email: email,}, process.env.JWT_SECRET, { expiresIn: "1h"})
    mongoose.connect(process.env.MONGODB_URL, {
        dbName: "kahootv2"
    })
    
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
    try
    {   
        const user = new User({
            ...req.body,
            password: hashedPassword + salt,
            confirmationToken: token,
            isVerified: false
        })
        await user.save()

        await transporter.sendMail(mailOptions);
        console.log("Mail sent");
        return res.redirect("login")
    }
    catch(err)
    {
        console.log(err)
        return res.redirect("signup")
    }
})

router.post("/login", async (req, res) => {
    let { email, password } = req.body
    try {
        mongoose.connect(process.env.MONGODB_URL, {
            dbName: "kahootv2"
        })
        if (!(email || password)) {
            throw {
                msg: "All input are required",
                code: 400
            }
        }
        const user = await User.findOne({ email: email })
        console.log(user)
        if (!user) {
            throw {
                msg: "User does not exist",
                code: 404
            }
        }
        else if (!user.isVerified) {
            throw {
                msg: "Please confirm your email adress before login",
                code: 401
            }
        }
        const salt = user.password.slice(-44)
        const newHashedPassword = crypto.createHmac("sha512", salt).update(password).digest("hex") + salt
        console.log(`newHashedPassword equal to database password: ${newHashedPassword == user.password}`)
        if (!(newHashedPassword === user.password)) {
            throw {
                msg: "Password incorrect",
                code: 400
            }
        } else {

        }
    } catch (error) {
        res.status(error.code).send(error.msg)
    }
})

module.exports = router