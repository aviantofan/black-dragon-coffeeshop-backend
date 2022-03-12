const profile = require('express').Router();
// const {
//   verifyUser
// } = require('../helpers/auth');
const {
  verifyUser
} = require('../middlewares/auth');

const {
  updateProfile,
  // updatePatchProfile,
  getProfile,
  updateUserProfile
  // updateUserProfile
} = require('../controllers/profile');
const {
  uploadMiddleware
} = require('../middlewares/upload');

profile.get('/:id', verifyUser, getProfile);
profile.put('/:id', verifyUser, updateProfile);
// profile.patch('/:id', verifyUser, uploadMiddleware('image'), updatePatchProfile);
profile.patch('/:id', verifyUser, uploadMiddleware('image'), updateUserProfile);
// profile.patch('/:id', verifyUser, updateUserProfile);

module.exports = profile;
