
const promotionSizes = require('express').Router();

const {
  insertPromotionSize,
  getPromotionSizes,
  getPromotionSize,
  updatePatchPromotionSize,
  deletePromotionSize
} = require('../controllers/promotionSize');

promotionSizes.post('/', insertPromotionSize);
promotionSizes.get('/', getPromotionSizes);
promotionSizes.get('/:id', getPromotionSize);
promotionSizes.patch('/:id', updatePatchPromotionSize);
promotionSizes.delete('/:id', deletePromotionSize);

module.exports = promotionSizes;
