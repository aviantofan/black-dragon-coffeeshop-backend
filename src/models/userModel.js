const db = require('../config/db');
const {
  userProfileTable
} = require('../helpers/constants');

exports.getUserByPhone = (phone) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT COUNT(*) as row FROM ${userProfileTable} WHERE phone = ?`, phone, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
};

exports.insert = (data) => {
  // provide phone is required
  return new Promise((resolve, reject) => {
    db.query(`INSERT INTO ${userProfileTable} SET ?`, data, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
};
