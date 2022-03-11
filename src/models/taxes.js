const db = require('../helpers/database');

exports.getTaxes = () => new Promise((resolve, reject) => {
  db.query('SELECT * FROM taxes_and_fees', (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.getTax = (id) => new Promise((resolve, reject) => {
  db.query('SELECT * FROM taxes_and_fees WHERE id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});
