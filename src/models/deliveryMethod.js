const db = require('../helpers/database');

exports.getDataDeliveryMethod = (id) => new Promise((resolve, reject) => {
    db.query('select * from delivery_methods where id=?', [id], (err, res) => {
        if (err) reject(err);
        resolve(res);
    });
});