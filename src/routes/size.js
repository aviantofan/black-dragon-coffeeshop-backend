const sizes = require('express').Router();

const {
  insertSize,
  getSizes,
  getSize,
  updateSize,
  deleteSize
} = require('../controllers/size');

sizes.post('/', insertSize);
sizes.get('/', getSizes);
sizes.get('/:id', getSize);
sizes.patch('/:id', updateSize);
sizes.delete('/:id', deleteSize);

module.exports = sizes;
