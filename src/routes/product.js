/* eslint-disable no-unused-vars */
const products = require('express').Router();
const {
  validateProduct
} = require('../helpers/validation');
// const { verifyUser } = require('../helpers/auth');

const {
  getProducts,
  getProduct,
  insertProduct,
  updateProduct,
  updatePatchProduct,
  deleteProduct
} = require('../controllers/product');

// products.get('/', verifyUser, getProducts);
products.get('/', getProducts);
products.get('/:id', getProduct);
products.post('/', insertProduct);
products.put('/:id', updateProduct);
products.patch('/:id', updatePatchProduct);
products.delete('/:id', deleteProduct);

module.exports = products;
