const route = require('express').Router()

route.use('/products', require('./product'))
route.use('/promotions', require('./promotion'))

module.exports = route
