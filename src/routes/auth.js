const auth = require('express').Router();

const {
  signup,
  verifyReset,
  login
} = require('../controllers/auth');

auth.post('/login', login);
// auth.post('/register', register)
auth.post('/signup', signup);
auth.post('/verify-reset', verifyReset);

module.exports = auth;
