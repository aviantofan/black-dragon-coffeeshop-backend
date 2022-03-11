const express = require('express');
const cors = require('cors');

// use it before all route definitions

require('dotenv').config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(require('./src/routes'));

const { PORT, APP_PORT } = process.env;

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

app.use('/uploads', express.static('uploads'));

app.listen(PORT || APP_PORT, () => {
  console.log(`App running on port ${PORT || APP_PORT}`);
});

// app.listen(() => {
//     console.log(`App running on port 5000`);
// });
