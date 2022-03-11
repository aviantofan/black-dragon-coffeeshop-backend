const db = require('../helpers/database')

exports.getDataUser = (id) => new Promise((resolve, reject) => {
    db.query('select * from user_profiles up join auth_users au on au.id = up.auth_user_id where au.id=?', [id], (err, res) => {
        if (err) reject(err)
        resolve(res)
    })
})


exports.getDataUerByEmail = (email) => new Promise((resolve, reject) => {
    const query = db.query('select * from auth_users where email=?', [email], (err, res) => {
        if (err) reject(err)
        resolve(res)
    })
})

exports.getDataUerByEmailUpdate = (email, id) => new Promise((resolve, reject) => {
    db.query('select * from auth_users where email=? and id!=?', [email, id], (err, res) => {
        if (err) reject(err)
        resolve(res)
    })
})


exports.insertDataUser = (data) => new Promise((resolve, reject) => {
    db.query('insert into auth_users set email = ?, password=?, role=\'user\'', [data.email, data.password], (err, res) => {
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

exports.updateDataUser = (data, id) => new Promise((resolve, reject) => {
    db.query('update auth_users set email = ? where id=?', [data.email, id], (err, res) => {
        if (err) reject(err)
        resolve(res)
    })
})

exports.updateDataUserProfile = (data, id) => new Promise((resolve, reject) => {
    const query = db.query('update user_profiles set ? where auth_user_id=?', [data, id], (err, res) => {
        if (err) reject(err)
        resolve(res)
    })
    console.log(query.sql)
})