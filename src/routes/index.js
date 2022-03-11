const route = require('express').Router();

route.use('/products', require('./product'));

module.exports = route;
