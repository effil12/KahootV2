const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { MongoClient, ObjectId } = require("mongodb")
const url = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.1"

function initialize (passport) {
    const authenticateUser = async (email, password, done) => {
        try {
            const client = await MongoClient.connect(url)
            const userCollection = client.db("kahootdb").collection('users')
            const user = await userCollection.findOne({ email: email })
            console.log(user)
            if (user == null) {
                return done(null, false, { message: 'No user with that email' })
            }
            console.log(`login password: ${password}, HashedPassword: ${user.password}`)
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => {
        console.log(`serialize: user:${user}`)
        return done(null, user._id)
    })
    passport.deserializeUser( async (id, done) => {
        const client = await MongoClient.connect(url)
        const userCollection = client.db('kahootdb').collection('Users')
        const user = await userCollection.findOne({ _id: ObjectId(id) })
        console.log(id)
        console.log(`deserialize user:${user}`)
        return done(null, user)
    })
}

module.exports = initialize