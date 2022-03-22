const db = require('../helpers/database');

exports.insertDataTax = (data) => new Promise((resolve, reject) => {
  db.query('INSERT INTO taxes_and_fees SET ? ', [data], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.getDataTaxes = (data) => new Promise((resolve, reject) => {
  db.query(`SELECT id, name, value FROM taxes_and_fees WHERE name like '%${data.name}%' LIMIT ${data.limit} OFFSET ${data.offset}`, (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.countDataTaxes = (data) => new Promise((resolve, reject) => {
  db.query(`SELECT COUNT(*) AS total FROM taxes_and_fees WHERE name like '%${data.name}%' LIMIT ${data.limit}`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

exports.getDataTax = (id) => new Promise((resolve, reject) => {
  db.query('SELECT * FROM taxes_and_fees WHERE id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.updateDataTax = (data, id) => new Promise((resolve, reject) => {
  db.query('UPDATE taxes_and_fees SET ? WHERE id=?', [data, id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.deleteDataTax = (id) => new Promise((resolve, reject) => {
  db.query('DELETE FROM taxes_and_fees WHERE id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});
