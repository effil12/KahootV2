const express = require('express')
const { MongoClient } = require('mongodb')
const app = express()
const port = process.env.PORT || 8080

var adminRoutes = require('./routes/admin')
var confirm = require("./routes/confirm")

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

app.use(express.urlencoded( { extended: true} ))

app.use('/admin', adminRoutes)
app.use("/confirm", confirm)

app.listen(port, () => {
    var datetime = new Date();
    var message = "Server running on Port:- " + port + " Started at :- " + datetime;
    console.log(message);
})