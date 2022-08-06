/* eslint-disable no-console */
const models = require('../models');
const _ = require('underscore');

module.exports = {
  get: (req, res) => {
    models.reviews.getAll(req.query)
      .then((results) => {
        const result = { ...results };
        _.each(result, (key) => {
          result[key].photos = result[key].photos ? result[key].photos : [];
        });
        console.log(result);

        res.type('application/json');
        res.json({
          product: req.query.product_id,
          page: req.query.page || 1,
          count: req.query.count || 5,
          results,
        });
        res.end();
      })
      .catch((err) => {
        console.log('error getting review data from database', err);
        res.sendStatus(500);
      });
  },

  post: (req, res) => {
    models.reviews.postReview(req.body)
      .then(() => res.sendStatus(201))
      .catch((err) => {
        console.log('error posting review', err);
        res.sendStatus(500);
      });
  },

  putHelpful: (req, res) => {
    models.reviews.updateHelpful(req.params.review_id)
      .then(() => {
        res.sendStatus(204);
      })
      .catch((err) => {
        console.log('error updating helpfulness', err);
        res.sendStatus(500);
      });
  },

  putReport: (req, res) => {
    models.reviews.report(req.params.review_id)
      .then(() => {
        res.sendStatus(204);
      })
      .catch((err) => {
        console.log('error updating reported', err);
        res.sendStatus(500);
      });
  },
};
