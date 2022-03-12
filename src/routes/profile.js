const profile = require('express').Router()
const { verifyUser } = require('../helpers/auth');

const {
    getProfile,
    updateProfile,
    updatePatchProfile
} = require('../controllers/profile')

profile.get('/', verifyUser, getProfile)
profile.put('/:id', verifyUser, updateProfile)
profile.patch('/:id', verifyUser, updatePatchProfile)

module.exports = profile