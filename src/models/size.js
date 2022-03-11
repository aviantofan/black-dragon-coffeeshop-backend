const db = require('../helpers/database')

exports.getDataSize = (id) => new Promise((resolve, reject) => {
  db.query('select * from sizes where id=?', [id], (err, res) => {
    if (err) reject(err)
    resolve(res)
  })
})
