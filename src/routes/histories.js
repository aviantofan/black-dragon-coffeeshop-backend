const histories = require('express').Router()
const {
  verifyUser
} = require('../helpers/auth');

const {
  getHistories,
  getHistoryById
} = require('../controllers/histories')

histories.get('/', verifyUser, getHistories)
histories.get('/:id', verifyUser, getHistoryById)

module.exports = histories
