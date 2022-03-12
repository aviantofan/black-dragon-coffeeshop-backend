const productHistory = require('express').Router();
const { verifyUser } = require('../helpers/auth');

const {
  getProductHistoriesByIdHistory,
  insertProductHistory,
  updateDataProductHistory,
  updatePatchProductHistory,
  deleteProductHistory
} = require('../controllers/productHistory');

productHistory.get('/:idHistory', getProductHistoriesByIdHistory); // get all data product history by id history
productHistory.post('/', insertProductHistory);
productHistory.put('/:id', updateDataProductHistory);
productHistory.patch('/:id', updatePatchProductHistory);
productHistory.delete('/:id', deleteProductHistory);

module.exports = productHistory;
