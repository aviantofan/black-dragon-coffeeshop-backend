const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();
// use it before all route definitions

const {
  PORT,
  APP_PORT
} = process.env;

app.use(cors());

app.use(express.urlencoded({
  extended: true
}));

app.use(require('./src/routes'));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

app.use('/uploads', express.static('uploads'));

[
  'get',
  'post',
  'put',
  'patch',
  'delete'
].forEach(el => {
  app[el]('*', (req, res) => {
    res.status(404);
    res.json({
      success: false,
      message: 'Destination not found'
    });
  });
});

app.listen(PORT || APP_PORT, () => {
  console.log(`App running on port ${PORT || APP_PORT}`);
});

// app.listen(() => {
//     console.log(`App running on port 5000`);
// });
