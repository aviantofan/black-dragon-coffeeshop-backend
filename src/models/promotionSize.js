const db = require('../helpers/database');

exports.insertDataPromotionSize = (data) => new Promise((resolve, reject) => {
  db.query('insert into promotion_sizes set ?', [data], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.getDataPromotionSizes = (data) => new Promise((resolve, reject) => {
  const filled = ['size_id'];
  let resultFillter = '';
  filled.forEach((item) => {
    if (data.filter[item]) {
      resultFillter += ` and ${item}='${data.filter[item]}'`;
    }
  });

  const query = db.query(`SELECT ps.id AS id, pr.name AS promotion, s.name AS size
    FROM promotion_sizes ps JOIN promotions pr ON pr.id = ps.promotion_id 
    JOIN sizes s ON s.id = ps.size_id
    where s.name like '%${data.name}%' ${resultFillter}
    order by ${data.sort} ${data.order} LIMIT ${data.limit} OFFSET ${data.offset}`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
  console.log(query.sql);
});

exports.countDataPromotionSizes = (data) => new Promise((resolve, reject) => {
  const filled = ['size_id'];
  let resultFillter = '';
  filled.forEach((item) => {
    if (data.filter[item]) {
      resultFillter += ` and ${item}='${data.filter[item]}'`;
    }
  });

  db.query(`SELECT count(*) AS total FROM promotion_sizes ps JOIN promotions pr ON pr.id = ps.promotion_id 
  JOIN sizes s ON s.id = ps.size_id 
  where s.name like '%${data.name}%' ${resultFillter}`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

exports.getDataPromotionSize = (id) => new Promise((resolve, reject) => {
  db.query('select * from promotion_sizes where id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.updateDataPromotionSize = (data, id) => new Promise((resolve, reject) => {
  db.query('update promotion_sizes set ? where id=?', [data, id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.deleteDataPromotionSize = (id) => new Promise((resolve, reject) => {
  db.query('delete from promotion_sizes where id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});
