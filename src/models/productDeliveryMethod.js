const db = require('../helpers/database')

exports.getDataProductDeliveryMethodByIdProduct = (idProduct) => new Promise((resolve, reject) => {
    db.query(`SELECT pdm.id,pdm.product_id,p.name,pdm.delivery_method_id,dm.name as delivery_method_name 
              from product_delivery_methods pdm join products p on p.id = pdm.product_id join delivery_methods dm on dm.id = pdm.delivery_method_id
              where product_id=?`, [idProduct], (err, res) => {
        if (err) reject(err)
        resolve(res)
    })
})


exports.getDataProductDeliveryMethod = (id) => new Promise((resolve, reject) => {
    db.query(`SELECT pdm.id,pdm.product_id,p.name,pdm.delivery_method_id,dm.name as delivery_method_name 
    from product_delivery_methods pdm join products p on p.id = pdm.product_id join delivery_methods dm on dm.id = pdm.delivery_method_id
    where pdm.id = ?`, [id], (err, res) => {
        if (err) reject(err)
        resolve(res)
    })
})

exports.insertDataProductDeliveryMethod = (data) => new Promise((resolve, reject) => {
    db.query('insert into product_delivery_methods set ?', [data], (err, res) => {
        if (err) reject(err)
        resolve(res)
    })
})

exports.updateDataProductDeliveryMethod = (data, id) => new Promise((resolve, reject) => {
    db.query('update product_delivery_methods set ? where id=?', [data, id], (err, res) => {
        if (err) reject(err)
        resolve(res)
    })
})

exports.deleteDataProductDeliveryMethod = (id) => new Promise((resolve, reject) => {
    db.query('delete from product_delivery_methods where id=?', [id], (err, res) => {
        if (err) reject(err)
        resolve(res)
    })
})