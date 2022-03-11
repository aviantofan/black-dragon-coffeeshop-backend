const db = require('../helpers/database');

exports.getDataDeliveryMethod = () => new Promise((resolve, reject) => {
  db.query('SELECT * FROM delivery_methods', (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.getDataDeliveryMethod = (id) => new Promise((resolve, reject) => {
  db.query('SELECT * FROM delivery_methods WHERE id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});
