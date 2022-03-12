const db = require('../helpers/database')

exports.getDataUerByEmail = (email) => new Promise((resolve, reject) => {
  const query = db.query('select * from auth_users where email=?', [email], (err, res) => {
    if (err) reject(err)
    resolve(res)
  })

  console.log(query.sql)
})

exports.insertDataUser = (data) => new Promise((resolve, reject) => {
  const query = db.query('insert into auth_users set email = ?, password=?, role=\'user\'', [data.email, data.password], (err, res) => {
    if (err) reject(err)
    resolve(res)
  })
})

exports.insertDataUserProfile = (data) => new Promise((resolve, reject) => {
  db.query('insert into user_profiles set phone=?', [data.phone], (err, res) => {
    if (err) reject(err)
    resolve(res)
  })
})
