require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./routes');
// require('newrelic');


app.use(express.json());

app.use('/', router);

app.listen(process.env.PORT, () => {
  console.log('listening on port', process.env.PORT);
});


module.exports = app;