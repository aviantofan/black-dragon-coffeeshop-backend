/* eslint-disable no-unused-vars */
const promotions = require('express').Router();
// const { validatePromotion } = require('../helpers/validation')
// const { verifyUser } = require('../helpers/auth');

const {
  getPromotions,
  getPromotion
  // insertPromotion,
  // updatePromotion,
  // updatePatchPromotion,
  // deletePromotion
} = require('../controllers/promotion');

promotions.get('/', getPromotions);
promotions.get('/:id', getPromotion);
// promotions.post('/', insertPromotion)
// promotions.put('/:id', updatePromotion)
// promotions.patch('/:id', updatePatchPromotion)
// promotions.delete('/:id', deletePromotion)

module.exports = promotions;
