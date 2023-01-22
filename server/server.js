const express = require('express')
const { MongoClient } = require('mongodb')
const session = require("express-session")
const app = express()
const port = process.env.PORT || 8080

var adminRoutes = require('./routes/admin')
var confirm = require("./routes/confirm")

require("dotenv").config()

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next()
})
app.use(express.urlencoded( { extended: true} ))
app.use(express.json())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use('/admin', adminRoutes)
app.use("/confirm", confirm)

app.listen(port, () => {
    var datetime = new Date();
    var message = "Server running on Port:- " + port + " Started at :- " + datetime;
    console.log(message);
})