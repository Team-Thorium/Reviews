// make connection to database
require('dotenv').config();
const { Client } = require('pg');
const client = new Client();

client.connect()
  .then(() => {
    console.log('successfully connected to database');
  })
  .catch((err) => {
    console.log('error connecting to database', err);
  });

module.exports = client;