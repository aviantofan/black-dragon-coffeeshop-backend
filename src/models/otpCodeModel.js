const db = require('../config/db');
const {
  otpTable
} = require('../helpers/constants');

exports.insert = (data) => {
  // data must be an object with the following data like type, code, auth_user_id
  // type just be 'verify' or 'forgot'
  // code must be a 6 digit number
  // auth_user_id must be the id of the auth_user
  // example: { type: 'verify', code: '123456', auth_user_id: 1 }
  return new Promise((resolve, reject) => {
    db.query(`INSERT INTO ${otpTable} SET ?`, data, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
};
