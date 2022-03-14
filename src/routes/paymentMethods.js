const paymentMethod = require('express').Router();
const { verifyUser } = require('../helpers/auth');

const {
  getPaymentMethods,
  getPaymentMethod,
  insertPaymentNethod,
  updatePaymentMethod,
  deletePaymentMethod
} = require('../controllers/paymentMethod');

paymentMethod.get('/', getPaymentMethods);
paymentMethod.get('/:id', getPaymentMethod);
paymentMethod.post('/', verifyUser, insertPaymentNethod);
paymentMethod.patch('/:id', verifyUser, updatePaymentMethod);
paymentMethod.delete('/:id', verifyUser, deletePaymentMethod);

module.exports = paymentMethod;
