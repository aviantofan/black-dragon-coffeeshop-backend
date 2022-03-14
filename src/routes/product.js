/* eslint-disable no-unused-vars */
const products = require('express').Router();
const {
  verifyAdmin
} = require('../middlewares/auth');

const {
  // getProducts,
  getProduct,
  insertProduct,
  updateProduct,
  updatePatchProduct,
  deleteProduct,
  getFilterData,
  listProduct,
  getFavorites
} = require('../controllers/product');

// products.get('/', getProducts);
products.get('/', listProduct);
products.get('/filter', getFilterData);
products.get('/:id', getProduct);
products.post('/', verifyAdmin, insertProduct);
products.put('/:id', verifyAdmin, updateProduct);
products.patch('/:id', verifyAdmin, updatePatchProduct);
products.delete('/:id', verifyAdmin, deleteProduct);
products.get('/f/favorite', getFavorites);

module.exports = products;
