const db = require('../config/db');
const {
  authUserTable
} = require('../helpers/constants');

exports.insert = (data) => {
  // provide data as an object with the following data like email, password, role, confirm
  // example: { email: 'example@mail.com', password: '123456', role: 'user', confirm: '0' }
  // role must be 'user' or 'admin'
  // confirm must be '0'
  return new Promise((resolve, reject) => {
    db.query(`INSERT INTO ${authUserTable} SET ?`, data, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
};

exports.getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM ${authUserTable} WHERE email = ?`, email, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
};
