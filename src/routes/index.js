const route = require('express').Router()

route.use('/products', require('./product'))
route.use('/auth', require('./auth'))

module.exports = route
