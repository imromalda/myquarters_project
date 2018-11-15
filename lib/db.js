const mongoose = require('mongoose')
const config = require('config')

mongoose.Promise = Promise
let db = mongoose.createConnection(String("mongodb://localhost/R-project?authSource=admin"))

db.on('error', console.error.bind(console, 'connection to DB error: '))
db.once('open', function () {
  console.debug('[Server]', 'Connection with MongoDB installed')
})

module.exports = db

require('../models/UsersModel')
