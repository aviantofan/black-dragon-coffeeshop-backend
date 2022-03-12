const route = require('express').Router()

route.use('/products', require('./product'))
route.use('/promotions', require('./promotion'))
route.use('/promotionDeliveryMethods', require('./promotionDeliveryMethod'))

module.exports = route
