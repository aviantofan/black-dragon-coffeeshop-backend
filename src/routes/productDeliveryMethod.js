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
productDeliveryMethod.post('/', insertProductDeliveryNethod);
productDeliveryMethod.put('/:id', updateDataProductDeliveryMethod);
productDeliveryMethod.patch('/:id', updatePatchProductDeliveryMethod);
productDeliveryMethod.delete('/:id', deleteProdutDeliveryMethod);

module.exports = productDeliveryMethod;
