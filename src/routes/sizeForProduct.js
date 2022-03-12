/* eslint-disable no-unused-vars */
const sizeForProduct = require('express').Router()
const { verifyUser } = require('../helpers/auth');

const {
    getSizeForProductsByIdProduct,
    insertSizeForProduct,
    updateDataProductSize,
    updatePatchSizeForUpdate,
    deleteSizeForProduct
} = require('../controllers/sizeForProduct')

sizeForProduct.get('/:idProduct', getSizeForProductsByIdProduct) // get all size by id product
sizeForProduct.post('/', insertSizeForProduct)
sizeForProduct.put('/:id', updateDataProductSize)
sizeForProduct.patch('/:id', updatePatchSizeForUpdate)
sizeForProduct.delete('/:id', deleteSizeForProduct)


module.exports = sizeForProduct