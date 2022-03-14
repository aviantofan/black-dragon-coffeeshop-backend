const db = require('../helpers/database');
const { APP_URL } = process.env;

exports.getDataPromotions = (data) => new Promise((resolve, reject) => {
  const filled = ['discount_value', 'delivery_method_id'];
  let resultFillter = '';
  filled.forEach((item) => {
    if (data.filter[item]) {
      resultFillter += ` and ${item}='${data.filter[item]}'`;
    }
  });

  const query = db.query(`SELECT pr.name,pr.code,concat('${APP_URL}/',image) AS image,pr.description,pr.normal_price ,pr.discount_value, pr.available_start_at, pr.available_end_at
    FROM promotions pr where pr.name like '%${data.name}%' ${resultFillter}
    order by ${data.sort} ${data.order} LIMIT ${data.limit} OFFSET ${data.offset}`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
  console.log(query.sql);
});

exports.countDataPromotions = (data) => new Promise((resolve, reject) => {
  const filled = ['discount_value', 'delivery_method_id'];
  let resultFillter = '';
  filled.forEach((item) => {
    if (data.filter[item]) {
      resultFillter += ` and ${item}='${data.filter[item]}'`;
    }
  });

  db.query(`SELECT count(*) AS total 
  FROM promotions pr where pr.name like '%${data.name}%' ${resultFillter}`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

exports.getDataPromotion = (id) => new Promise((resolve, reject) => {
  db.query('select * from promotions where id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.insertDataPromotion = (data) => new Promise((resolve, reject) => {
  db.query('insert into promotions set ?', [data], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.updateDataPromotion = (data, id) => new Promise((resolve, reject) => {
  db.query('update promotions set ? where id=?', [data, id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.deleteDataPromotion = (id) => new Promise((resolve, reject) => {
  db.query('delete from promotions where id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});
