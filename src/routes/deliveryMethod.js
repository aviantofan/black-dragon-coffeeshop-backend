const deliveryMethods = require('express').Router();

const {
  insertDeliveryMethod,
  getDeliveryMethods,
  getDeliveryMethod,
  updateDeliveryMethod,
  deleteDeliveryMethod
} = require('../controllers/deliveryMethod');

deliveryMethods.post('/', insertDeliveryMethod);
deliveryMethods.get('/', getDeliveryMethods);
deliveryMethods.get('/:id', getDeliveryMethod);
deliveryMethods.patch('/:id', updateDeliveryMethod);
deliveryMethods.delete('/:id', deleteDeliveryMethod);

module.exports = deliveryMethods;
