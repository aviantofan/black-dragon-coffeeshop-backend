const route = require('express').Router()

route.use('/products', require('./product'))
route.use('/promotions', require('./promotion'))
route.use('/promotionDeliveryMethods', require('./promotionDeliveryMethod'))
route.use('/promotionSizes', require('./promotionSize'))

module.exports = route
