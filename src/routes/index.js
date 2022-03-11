const express = require('express');
const route = new express.Router();

module.exports = route;

route.use('/products', require('./product'));
route.use('/categories', require('./category'));

module.exports = route;
