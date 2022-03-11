const auth = require('express').Router();

const {
  signup,
  verifyReset
} = require('../controllers/auth');

auth.post('/signup', signup);
auth.post('/verify-reset', verifyReset);

module.exports = auth;
