const db = require('../helpers/database');

exports.getDataSizes = () => new Promise((resolve, reject) => {
  db.query('SELECT * FROM sizes', (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.getDataSize = (id) => new Promise((resolve, reject) => {
  db.query('SELECT * FROM sizes WHERE id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});
