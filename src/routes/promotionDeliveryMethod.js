const promotionDeliveryMethods = require('express').Router();

const {
  // module-promotion-delivery-method
  insertPromotionDeliveryMethod,
  getPromotionDeliveryMethods,
  getListPromotionByIdPromotion,
  getPromotionDeliveryMethod,
  updatePatchPromotionDeliveryMethod2,
  // updatePatchPromotionDeliveryMethod,
  // deletePromotionDeliveryMethod
  deletePromotionDeliveryMethod2
} = require('../controllers/promotionDeliveryMethod');

promotionDeliveryMethods.post('/', insertPromotionDeliveryMethod);
promotionDeliveryMethods.get('/', getPromotionDeliveryMethods);
promotionDeliveryMethods.get('/:id', getPromotionDeliveryMethod);
promotionDeliveryMethods.get('/promo/:idPromotion', getListPromotionByIdPromotion);
// promotionDeliveryMethods.patch('/:id', updatePatchPromotionDeliveryMethod);
promotionDeliveryMethods.patch('/:id', updatePatchPromotionDeliveryMethod2);
// promotionDeliveryMethods.delete('/:id', deletePromotionDeliveryMethod);
promotionDeliveryMethods.delete('/:id', deletePromotionDeliveryMethod2);

module.exports = promotionDeliveryMethods;
