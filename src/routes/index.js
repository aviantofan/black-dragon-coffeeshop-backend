const route = require('express').Router();

route.use('/products', require('./product'));
route.use('/auth', require('./auth'));
route.use('/profile', require('./profile'));
route.use('/categories', require('./category'));
route.use('/histories', require('./histories'));

module.exports = route;
