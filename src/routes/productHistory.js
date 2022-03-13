const productHistory = require('express').Router();
const { verifyUser } = require('../helpers/auth');

const {
  getProductHistoriesByIdHistory,
  insertProductHistory,
  updateDataProductHistory,
  updatePatchProductHistory,
  deleteProductHistory
} = require('../controllers/productHistory');

productHistory.get('/:idHistory', verifyUser, getProductHistoriesByIdHistory); // get all data product history by id history
productHistory.post('/', verifyUser, insertProductHistory);
productHistory.put('/:id', verifyUser, updateDataProductHistory);
productHistory.patch('/:id', verifyUser, updatePatchProductHistory);
productHistory.delete('/:id', verifyUser, deleteProductHistory);

module.exports = productHistory;
