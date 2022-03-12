
const promotionDeliveryMethods = require('express').Router();

const {
  insertPromotionDeliveryMethod,
  getPromotionDeliveryMethods,
  getPromotionDeliveryMethod,
  updatePatchPromotionDeliveryMethod,
  deletePromotionDeliveryMethod
} = require('../controllers/promotionDeliveryMethod');

promotionDeliveryMethods.post('/', insertPromotionDeliveryMethod);
promotionDeliveryMethods.get('/', getPromotionDeliveryMethods);
promotionDeliveryMethods.get('/:id', getPromotionDeliveryMethod);
promotionDeliveryMethods.patch('/:id', updatePatchPromotionDeliveryMethod);
promotionDeliveryMethods.delete('/:id', deletePromotionDeliveryMethod);

module.exports = promotionDeliveryMethods;
