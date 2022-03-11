const db = require('../helpers/database')

exports.getDataCategory = (id) => new Promise((resolve, reject) => {
  db.query('select * from categories where id=?', [id], (err, res) => {
    if (err) reject(err)
    resolve(res)
  })
})
