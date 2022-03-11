<<<<<<< HEAD
const express = require('express');
const route = new express.Router();

module.exports = route;
=======
const route = require('express').Router()

route.use('/products', require('./product'))

module.exports = route
>>>>>>> 153fdd5d145d2424bffb8b3ef55ba01d06959187
