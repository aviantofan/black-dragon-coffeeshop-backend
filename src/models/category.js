const db = require('../helpers/database');

exports.insertDataCategory = (data) => new Promise((resolve, reject) => {
  db.query('INSERT INTO categories SET ?', [data], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

// exports.getDataCategories = () => new Promise((resolve, reject) => {
//   db.query('SELECT * FROM categories', (err, res) => {
//     if (err) reject(err);
//     resolve(res);
//   });
// });

exports.getDataCategory = (id) => new Promise((resolve, reject) => {
  db.query('SELECT * FROM categories where id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.getDataCategoryByName = (name) => new Promise((resolve, reject) => {
  db.query('SELECT * FROM categories where name=?', [name], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.updateDataCategory = (data, id) => new Promise((resolve, reject) => {
  db.query('UPDATE categories SET ? WHERE id=?', [data, id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.deleteDataCategory = (id) => new Promise((resolve, reject) => {
  db.query('DELETE FROM categories WHERE id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.getDataCategories = (data) => new Promise((resolve, reject) => {
  const query = db.query(`SELECT id, name FROM categories WHERE name like '%${data.name}%' LIMIT ${data.limit} OFFSET ${data.offset}`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
  console.log(query.sql);
});

exports.countDataCategories = (data) => new Promise((resolve, reject) => {
  db.query(`SELECT COUNT(*) AS total FROM categories where name like '%${data.name}%' LIMIT ${data.limit} `, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});
