const db = require('../helpers/database');

exports.insertDataSize = (data) => new Promise((resolve, reject) => {
  db.query('INSERT INTO sizes SET ? ', [data], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.getDataSizes = (data) => new Promise((resolve, reject) => {
  const query = db.query(`SELECT * FROM sizes WHERE name like '%${data.name}%' LIMIT ${data.limit} OFFSET ${data.offset}`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
  console.log(query.sql);
});

exports.countDataSizes = (data) => new Promise((resolve, reject) => {
  db.query(`SELECT COUNT(*) AS total FROM sizes where name like '%${data.name}%' LIMIT ${data.limit} `, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

exports.getDataSize = (id) => new Promise((resolve, reject) => {
  db.query('select * from sizes where id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.updateDataSize = (data, id) => new Promise((resolve, reject) => {
  db.query('UPDATE sizes SET ? WHERE id=?', [data, id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.deleteDataSize = (id) => new Promise((resolve, reject) => {
  db.query('DELETE FROM sizes WHERE id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});
