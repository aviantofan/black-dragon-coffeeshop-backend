const histories = require('express').Router();
const { verifyUser } = require('../helpers/auth');

const {
  getHistories
} = require('../controllers/histories');

histories.get('/', getHistories);

module.exports = histories;
