const route = require('express').Router()

route.use('/products', require('./product'))
route.use('/auth', require('./auth'))
route.use('/profile', require('./profile'))

module.exports = route