const categories = require('express').Router();

const {
  insertCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/category');

categories.post('/', insertCategory);
categories.get('/', getCategories);
categories.get('/:id', getCategory);
categories.patch('/:id', updateCategory);
categories.delete('/:id', deleteCategory);

module.exports = categories;
