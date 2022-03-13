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

exports.update = (id, data) => {
  // provide data as an object with the following data like email, password, role, confirm
  console.log(data);
  return new Promise((resolve, reject) => {
    db.query(`UPDATE ${authUserTable} SET ? WHERE id = ${id}`, data, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
    // console.log(ss.sql, 'update');
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

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM ${authUserTable} WHERE id = ?`, id, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
};
