const db = require('../helpers/database');

exports.insertDataDeliveryMethod = (data) => new Promise((resolve, reject) => {
  db.query('INSERT INTO delivery_methods SET ?', [data], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.getDataDeliveryMethods = () => new Promise((resolve, reject) => {
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

exports.updateDataDeliveryMethod = (data, id) => new Promise((resolve, reject) => {
  db.query('UPDATE delivery_methods SET ? WHERE id=?', [data, id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.deleteDataDeliveryMethod = (id) => new Promise((resolve, reject) => {
  db.query('DELETE FROM delivery_methods WHERE id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.getDataDeliveryMethods = (data) => new Promise((resolve, reject) => {
  const query = db.query(`SELECT name FROM delivery_methods WHERE name like '%${data.name}%' LIMIT ${data.limit} OFFSET ${data.offset}`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
  console.log(query.sql);
});

exports.countDataDeliveryMethods = (data) => new Promise((resolve, reject) => {
  db.query(`SELECT COUNT(*) AS total FROM delivery_methods where name like '%${data.name}%' LIMIT ${data.limit} `, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});
