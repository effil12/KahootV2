const mongoose = require("mongoose")

require("dotenv").config()

const createMongoDBConnection = () => {
    console.log(process.env.MONGODB_URL)
    try {
        mongoose.connect(process.env.MONGODB_URL, {
            dbName: "kahootv2"
        })
        mongoose.connection.on("error", () => {
            throw new Error("MongoDB connection failed");
        })
    } catch (error) {
        console.error(error)
    }
}

module.exports = {createMongoDBConnection}