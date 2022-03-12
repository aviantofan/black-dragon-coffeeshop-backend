const db = require('../helpers/database')
// const {
//   APP_URL
// } = process.env

exports.getDataHistoriesByFilter = (data) => new Promise((resolve, reject) => {
  const filled = ['category_id', 'size_id', 'delivery_method_id', 'payment_method_id', 'delivery_time']
  let resultFillter = ''
  filled.forEach((item) => {
    if (data.filter[item]) {
      if (item === 'delivery_time') {
        resultFillter += ` and DATE_FORMAT(${item}, "%Y-%m-%d")='${data.filter[item]}'`
      } else {
        resultFillter += ` and ${item}='${data.filter[item]}'`
      }
    }
  })

  const query = db.query(`select p.name,p.price
    from histories h join product_histories ph on ph.history_id = h.id 
    join products p on p.id = ph.product_id
    where p.name like '%${data.name}%' ${resultFillter}
    order by ${data.sort} ${data.order} LIMIT ${data.limit} OFFSET ${data.offset}`, (error, result) => {
    if (error) reject(error)
    resolve(result)
  })

  console.log(query.sql)
})

exports.countDataHistoriesByFilter = (data) => new Promise((resolve, reject) => {
  const filled = ['date', 'category_id', 'size_id', 'delivery_method_id']
  let resultFillter = ''
  filled.forEach((item) => {
    if (data.filter[item]) {
      resultFillter += ` and ${item}='${data.filter[item]}'`
    }
  })

  db.query(`select count(*) as total
    from histories h join product_histories ph on ph.history_id = h.id join products p on p.id = ph.product_id
    where p.name like '%${data.name}%' ${resultFillter}
    order by ${data.sort} ${data.order}`, (error, result) => {
    if (error) reject(error)
    resolve(result)
  })
})

exports.getHistoryById = (id) => new Promise((resolve, reject) => {
  db.query(`select * from histories where id = ${id}`, (error, result) => {
    if (error) reject(error)
    resolve(result)
  });
});
