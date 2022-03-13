const histories = require('express').Router();
const {
  verifyUser
} = require('../middlewares/auth');

const {
  getHistories,
  getHistoriesById,
  insertHistories,
  updateDataHistory,
  deleteDataHistory
} = require('../controllers/histories');

histories.get('/', verifyUser, getHistories);
histories.get('/:id', verifyUser, getHistoriesById);
histories.post('/', verifyUser, insertHistories);
histories.patch('/:id', verifyUser, updateDataHistory);
histories.delete('/:id', verifyUser, deleteDataHistory);
