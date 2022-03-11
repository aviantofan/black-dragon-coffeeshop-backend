const jwt = require('jsonwebtoken');
const showApi = require('../helpers/showResponse');
const { APP_SECRET } = process.env;

exports.verifyUser = (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth.startsWith('Bearer')) {
    const token = auth.split(' ')[1];
    if (token) {
      try {
        const payload = jwt.verify(token, APP_SECRET);
        req.user = payload;
        if (jwt.verify(token, APP_SECRET)) {
          return next();
        } else {
          return showApi.showResponse(res, 'User not verified!', null, 403);
        }
      } catch (err) {
        return showApi.showResponse(res, 'User not verified!', null, 403);
      }
    } else {
      return showApi.showResponse(res, 'Token must be provided!', null, 403);
    }
  }
};
