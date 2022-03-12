const db = require('../helpers/database')

exports.getDataSizeOfProductByIdProduct = (idProduct) => new Promise((resolve, reject) => {
    db.query('select sfp.id,sfp.product_id,p.name,sfp.size_id,s.name from sizes_for_product sfp join sizes s on s.id = sfp.size_id join products p on p.id = sfp.product_id where product_id=?', [idProduct], (err, res) => {
        if (err) reject(err)
        resolve(res)
    })
})


exports.getDataSizeOfProduct = (id) => new Promise((resolve, reject) => {
    db.query('select sfp.id,sfp.product_id,p.name,sfp.size_id,s.name from sizes_for_product sfp join sizes s on s.id = sfp.size_id join products p on p.id = sfp.product_id where sfp.id=?', [id], (err, res) => {
        if (err) reject(err)
        resolve(res)
    })
})

exports.insertDataProductSize = (data) => new Promise((resolve, reject) => {
    db.query('insert into sizes_for_product set ?', [data], (err, res) => {
        if (err) reject(err)
        resolve(res)
    })
})

exports.updateDataProductSize = (data, id) => new Promise((resolve, reject) => {
    console.log(data)
    const query = db.query('update sizes_for_product set ? where id=?', [data, id], (err, res) => {
        if (err) reject(err)
        resolve(res)
    })

    console.log(query.sql)
})

exports.deleteDataProductSize = (id) => new Promise((resolve, reject) => {
    const query = db.query('delete from sizes_for_product where id=?', [id], (err, res) => {
        if (err) reject(err)
        resolve(res)
    })
    console.log(query.sql)
})