const db = require('../helpers/database')

exports.getDataCategories = () => new Promise((resolve, reject) => {
  db.query('SELECT * FROM categories', (err, res) => {
    if (err) reject(err)
    resolve(res)
  })
})

exports.getDataCategory = (id) => new Promise((resolve, reject) => {
  db.query('SELECT * FROM categories where id=?', [id], (err, res) => {
    if (err) reject(err)
    resolve(res)
  })
})
