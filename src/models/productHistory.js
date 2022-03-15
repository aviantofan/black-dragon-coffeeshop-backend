const db = require('../helpers/database');
const moment = require('moment');

exports.getDataHistoryProductByIdHistory = (idHistory) => new Promise((resolve, reject) => {
  db.query(`SELECT ph.id,h.delivery_time,h.total,ph.product_id,p.name
            FROM product_histories ph join histories h on ph.history_id = h.id join products p on p.id = product_id
            where ph.history_id=? and ph.deleted_at is null`, [idHistory], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.getDataProductHistory = (id) => new Promise((resolve, reject) => {
  db.query(`SELECT ph.id,h.delivery_time,h.total,ph.product_id,p.name,ph.qty,ph.size_id,s.name as size
          FROM product_histories ph join histories h on ph.history_id = h.id join products p on p.id = product_id
          join sizes s on s.id = ph.size_id
          where ph.id=?`, [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.countDataHistoryProductByIdHistory = (data, idHistory) => new Promise((resolve, reject) => {
  db.query(`select count(*) as total 
      FROM product_histories ph join histories h on ph.history_id = h.id join products p on p.id = product_id
      where ph.id=?
    order by ${data.sort} ${data.order}`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

exports.insertDataProductHistory = (data) => new Promise((resolve, reject) => {
  db.query('insert into product_histories set ?', [data], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.updateDataProductHistory = (data, id) => new Promise((resolve, reject) => {
  db.query('update product_histories set ? where id=?', [data, id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.deleteDataProductHistory = (id) => new Promise((resolve, reject) => {
  // db.query('delete from product_histories where id=?', [id], (err, res) => {
  //     if (err) reject(err)
  //     resolve(res)
  // })
  // console.log(new Date(Date.now()))
  db.query(`update product_histories set deleted_at = '${moment(new Date(Date.now())).format('YYYY-MM-DD HH:mm:ss')}' where id=?`, [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});
