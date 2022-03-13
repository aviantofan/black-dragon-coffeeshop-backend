const deliveryMethods = require('express').Router();

const {
  insertDataDeliveryMethod,
  getDataDeliveryMethods,
  getDataDeliveryMethod,
  updateDataDeliveryMethod,
  deleteDataDeliveryMethod
} = require('../controllers/deliveryMethod');

deliveryMethods.post('/', insertDataDeliveryMethod);
deliveryMethods.get('/', getDataDeliveryMethods);
deliveryMethods.get('/:id', getDataDeliveryMethod);
deliveryMethods.patch('/:id', updateDataDeliveryMethod);
deliveryMethods.delete('/:id', deleteDataDeliveryMethod);

module.exports = deliveryMethods;
