const db = require('../helpers/database');
const { APP_URL } = process.env;

exports.getDataProducts = (data) => new Promise((resolve, reject) => {
  const filled = ['price', 'stocks', 'time', 'category_id'];
  let resultFillter = '';
  filled.forEach((item) => {
    if (data.filter[item]) {
      resultFillter += ` and ${item}='${data.filter[item]}'`;
    }
  });

  const query = db.query(`select p.id,p.name,p.price,concat('${APP_URL}/',image) as image,p.stocks,p.delivery_time_start,p.delivery_time_end,p.category_id,c.name categpry
    from products p join categories c on c.id = p.category_id
    where p.name like '%${data.name}%' ${resultFillter}
   order by ${data.sort} ${data.order} LIMIT ${data.limit} OFFSET ${data.offset}`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
  console.log(query.sql);
});

exports.countDataProducts = (data) => new Promise((resolve, reject) => {
  const filled = ['category_id'];
  let resultFillter = '';
  filled.forEach((item) => {
    if (data.filter[item]) {
      resultFillter += ` and ${item}='${data.filter[item]}'`;
    }
  });

  db.query(`select count(*) as total 
    from products p join categories c on c.id = p.category_id
    where p.name like '%${data.name}%' ${resultFillter}
    order by ${data.sort} ${data.order}`, (error, result) => {
    if (error) reject(error);
    resolve(result);
  });
});

exports.getDataProduct = (id) => new Promise((resolve, reject) => {
  db.query('select * from products where id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.insertDataProduct = (data) => new Promise((resolve, reject) => {
  db.query('insert into products set ?', [data], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.insertDataProductSize = (data) => new Promise((resolve, reject) => {
  db.query('insert into sizes_for_product set ?', [data], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.insertDataProductDeliveryMethod = (data) => new Promise((resolve, reject) => {
  db.query('insert into product_delivery_methods set ?', [data], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.updateDataProduct = (data, id) => new Promise((resolve, reject) => {
  db.query('update products set ? where id=?', [data, id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.updateDataProductSize = (data, id) => new Promise((resolve, reject) => {
  console.log(data);
  const query = db.query('update sizes_for_product set ? where product_id=?', [data, id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });

  console.log(query.sql);
});

exports.updateDataProductDeliveryMethod = (data, id) => new Promise((resolve, reject) => {
  db.query('update product_delivery_methods set ? where product_id=?', [data, id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.deleteDataProduct = (id) => new Promise((resolve, reject) => {
  db.query('delete from products where id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});

exports.deleteDataProductSize = (id) => new Promise((resolve, reject) => {
  const query = db.query('delete from sizes_for_product where product_id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
  console.log(query.sql);
});

exports.deleteDataProductDeliveryMethod = (id) => new Promise((resolve, reject) => {
  db.query('delete from product_delivery_methods where product_id=?', [id], (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});