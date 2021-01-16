const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    roles: [String],
    permissions: [String]
})

module.exports = {
    User: new mongoose.model('User', userSchema)
}