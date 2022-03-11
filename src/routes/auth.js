/* eslint-disable no-unused-vars */
const auth = require('express').Router()
// const { verifyUser } = require('../helpers/auth');

const {
  login,
  register
} = require('../controllers/auth')

auth.post('/login', login)
auth.post('/register', register)

module.exports = auth
