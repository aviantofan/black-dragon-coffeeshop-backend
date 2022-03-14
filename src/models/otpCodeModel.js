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

exports.getByUserId = (id) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM ${otpTable} WHERE auth_user_id = ?`, id, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
};

exports.getByData = (data, withNull = false) => {
  const {
    code,
    type,
    authUserId
  } = data;

  const query = `
  SELECT * FROM ${otpTable} 
  WHERE 
  code = ? 
  AND type = ? 
  AND auth_user_id = ? 
  ${!withNull ? '' : 'AND expired = 0'}
  `;

  return new Promise((resolve, reject) => {
    db.query(query, [code, type, authUserId], (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
    // console.log(ss.sql);
  });
};

exports.delete = (id) => {
  return new Promise((resolve, reject) => {
    db.query(`DELETE FROM ${otpTable} WHERE id = ?`, id, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
};

exports.updateExpired = (id) => {
  return new Promise((resolve, reject) => {
    const ss = db.query(`UPDATE ${otpTable} SET expired = 1 WHERE id = ?`, id, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
    console.log(ss.sql);
  });
};
