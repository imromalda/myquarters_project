'use strict'
const express = require('express')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const util = require('util')
const httpStatus = require('http-status-codes')
const errorCodes = require('./lib/messages')

/* Register all libs */
require('./lib/db')
/* Register all routes */
const userRouter = require('./routes/authRouter')
const app = express()

app.set('view engine', 'pug')

// default options
app.use(fileUpload({
  limits: { fileSize: 1 * 1024 * 1024 }
}))

// Enable Cross Origin Resource Sharing
app.all('/*', function (req, res, next) {
  // CORS headers
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Headers',
      'Content-Type,X-Access-Token,Cache-Control, pcode')
    return res.status(httpStatus.OK).end()
  } else {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    next()
  }
})


const API = '/project/v1/'

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json({limit: 1024102420, type: 'application/json'}))

app.use(API + 'user' , userRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  return res.status(httpStatus.NOT_FOUND).json({
    statusCode: 'NotFound',
    statusText: util.format(errorCodes.NotFound, req.url)
  })
})

// error handler
app.use(function (err, req, res, next) {
  console.error('[ExpressHandler]', err)
  return res.status(httpStatus.BAD_REQUEST).json({
    statusCode: 'BadRequest',
    statusText: errorCodes.BadRequest
  })
})

process.on('uncaughtException', (err) => {
  console.error('[UncaughtException]', err)
})

console.debug('[Server]', 'Server running mode')

module.exports = app
