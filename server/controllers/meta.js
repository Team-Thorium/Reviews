/* eslint-disable no-console */
const models = require('../models');

module.exports = {
  get: (req, res) => {
    models.meta.getMeta(req.query.product_id)
      .then((results) => {
        res.type('application/json');
        res.json(results[0]);
        res.end();
      })
      .catch((err) => {
        console.log('error getting meta data from database', err);
        res.sendStatus(500);
      });
  },
};
