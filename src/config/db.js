const mysql = require('mysql');

const {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_USER
} = process.env;

const conn = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
});

conn.connect();
console.log('Connected to database');

module.exports = conn;
