const productDeliveryMethod = require('express').Router();
const { verifyUser } = require('../helpers/auth');

const {
  getProductDeliveryMethodByIdProduct,
  insertProductDeliveryNethod,
  updateDataProductDeliveryMethod,
  updatePatchProductDeliveryMethod,
  deleteProdutDeliveryMethod
} = require('../controllers/productDeliveryMethod');

productDeliveryMethod.get('/:idProduct', getProductDeliveryMethodByIdProduct); // get all size by id product
productDeliveryMethod.post('/', verifyUser, insertProductDeliveryNethod);
productDeliveryMethod.put('/:id', verifyUser, updateDataProductDeliveryMethod);
productDeliveryMethod.patch('/:id', verifyUser, updatePatchProductDeliveryMethod);
productDeliveryMethod.delete('/:id', verifyUser, deleteProdutDeliveryMethod);

module.exports = productDeliveryMethod;
