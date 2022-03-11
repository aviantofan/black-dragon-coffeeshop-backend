const auth = require('express').Router();

const {
  signup
} = require('../controllers/auth');

auth.post('/signup', signup);

module.exports = auth;
