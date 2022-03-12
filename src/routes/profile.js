const profile = require('express').Router();
// const {
//   verifyUser
// } = require('../helpers/auth');
const {
  verifyUser
} = require('../middlewares/auth');

const {
  getProfile,
  updateProfile,
  updatePatchProfile
} = require('../controllers/profile');

profile.get('/:id', verifyUser, getProfile);
profile.put('/:id', verifyUser, updateProfile);
profile.patch('/:id', verifyUser, updatePatchProfile);

module.exports = profile;
