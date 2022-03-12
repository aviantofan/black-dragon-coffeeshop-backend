const db = require('../config/db');
const {
  userProfileTable,
  authUserTable
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

exports.getDataUerByEmail = (email) => new Promise((resolve, reject) => {
  const query = db.query(`select * from ${authUserTable} where email=?`, [email], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });

  console.log(query.sql);
});
