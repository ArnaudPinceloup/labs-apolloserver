const mongoose = require('mongoose')

const petSchema = new mongoose.Schema({
    name: String,
    owner: String,
    type: String,
    img: String,
    createdAt: Number
})

module.exports = {
    Pet: new mongoose.model('Pet', petSchema)
}