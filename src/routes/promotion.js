/* eslint-disable no-unused-vars */
const promotions = require('express').Router();
const verify = require('jsonwebtoken/verify');
// const { validatePromotion } = require('../helpers/validation')
const {
  verifyUser
} = require('../helpers/auth');
const {
  uploadMiddleware
} = require('../middlewares/upload');

const {
  getPromotions,
  getPromotion,
  insertPromotion,
  updatePromotion,
  deletePromotion
} = require('../controllers/promotion');

promotions.get('/', getPromotions);
promotions.get('/:id', getPromotion);
promotions.post('/', verifyUser, uploadMiddleware('image'), insertPromotion);
promotions.put('/:id', verifyUser, uploadMiddleware('image'), updatePromotion);
promotions.delete(
  '/:id',
  verifyUser,
  uploadMiddleware('image'),
  deletePromotion
);

module.exports = promotions;
