const db = require('../helpers/database');

exports.getTax = () => new Promise((resolve, reject) => {
  db.query('SELECT * FROM taxes_and_fees', (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.getTaxes = (id) => new Promise((resolve, reject) => {
  db.query('SELECT * FROM taxes_and_fees WHERE id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});
