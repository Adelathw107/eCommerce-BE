'use strict'
const mongoose = require('mongoose')

const connectString = 'mongodb://localhost:27017/shopdev'

mongoose.connect(connectString).then(() => console.log("Connected MongoDB success")).catch(err => console.log("Error Connect: ", err.message))

// dev
if (1 === 1) {
    mongoose.set('debug', true)
    mongoose.set('debug', { color: true })
}

module.exports = mongoose;