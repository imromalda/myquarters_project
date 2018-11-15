'use strict'

const db = require('../lib/db')
const loggerName = '[AuthController]'
const userModel = db.model('Users')
const httpStatus = require('http-status-codes')

module.exports.register = (req, res, next) => {
    const methodName = loggerName + '[Register]'

    const username = req.body.username
    const password = req.body.password
    const security = req.body.security

    if (!username) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: 'Please provide username'
        })
    }
    if (!password) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: 'Please provide password'
        })
    }
    if (!security) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: 'Please provide security'
        })
    }

let newUser = new userModel({
    username: username,
    password: password,
    security: security
})
    newUser.save(function (err, user) {
        if(err){
            console.error(methodName, err)
            return next(err)
        }
        return res.send(user)
    })
}

module.exports.forgotPassword = (req, res, next) => {
    const methodName = loggerName + '[ForgotPassword]'

    const username = req.body.username
    const security = req.body.security
    if (!username) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: 'Please provide username'
        })
    }

    if (!security) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: 'Please provide security'
        })
    }
    let userCheck = userModel.findOne({username: username, security: security})
        userCheck.exec(function (err, user) {
            if(!user){
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: 'Wrong credentials provided'
                })
            }
            return res.json({message: 'Please set new password'}  )
        })
}


module.exports.changePassword = (req, res, next) => {
    const methodName = loggerName + '[ChangePassword]'
    const username = req.body.username
    const password = req.body.password
    const confirmation = req.body.confirmation

    if(!username){
        return res.status('BAD_REQUEST').json({
            message: 'Please provide username'
        })
    }
    if (!password) {
        return res.status('BAD_REQUEST').json({
            message: 'Please provide password'
        })
    }

    if (!confirmation) {
        return res.status('BAD_REQUEST').json({
            message: 'Please Re-enter password'
        })
    }

    if (password !== confirmation) {
        return res.status('BAD_REQUEST').json({
           message: 'Password do not match'
        })
    }
    const selectQuery = {
        username: username
    }

    const updateQuery = {
        password: password
    }

    userModel.findOneAndUpdate(selectQuery, updateQuery, {new: true}).exec((err, user) => {
        if (err) {
            console.error(methodName, err)
            return next(err)
        }

        if (!user) {
            return res.status('BAD_REQUEST').json({
              message: 'User not found'
            })
        }
        return res.json({
            message: 'Password Changed successfully'
        })

    })
}

module.exports.login = (req, res, next)=>{
    const methodName = loggerName + '[Login]'
    const username = req.body.username
    const password = req.body.password

    if(!username){
        return res.status(httpStatus.BAD_REQUEST).json({
            message: 'Please provide username'
        })
    }
    if (!password) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: 'Please provide password'
        })
    }
     let user = userModel.findOne({username: username, password: password})

    user.exec(function (err, user) {
        if (err) {
            console.error(methodName, err)
            return next(err)
        }

        if (!user) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: 'User doesnt exist'
            })
        }
        return res.json({
            message: 'Logged in successfully'
        })

    })

}


