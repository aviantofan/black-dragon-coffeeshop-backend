const route = require('express').Router()

route.use('/products', require('./product'))
route.use('/auth', require('./auth'))
route.use('/histories', require('./histories'))
route.use('/sizeForProduct', require('./sizeForProduct'))
route.use('/productDeliveryMethod', require('./productDeliveryMethod'))

module.exports = route