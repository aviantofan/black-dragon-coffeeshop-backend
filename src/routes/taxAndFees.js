
const taxes = require('express').Router();

const {
  insertTax,
  getTaxes,
  getTax,
  updateTax,
  deleteTax
} = require('../controllers/taxAndFees');

taxes.post('/', insertTax);
taxes.get('/', getTaxes);
taxes.get('/:id', getTax);
taxes.patch('/:id', updateTax);
taxes.delete('/:id', deleteTax);

module.exports = taxes;
