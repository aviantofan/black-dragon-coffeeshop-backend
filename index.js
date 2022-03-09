const express = require('express');
const app = express();

const PORT = 3000;
const APP_PORT = process.env || PORT;

app.use(express.urlencoded({
  extended: true
}));

app.listen(APP_PORT, () => {
  console.log(`App is running in port ${PORT || APP_PORT}`);
});
