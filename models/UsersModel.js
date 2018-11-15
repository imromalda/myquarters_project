'use strict'

const db = require('../lib/db')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UsersSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    security: {
        type: String,
        required: true
    }
})
const model = db.model('Users', UsersSchema)
module.exports = model