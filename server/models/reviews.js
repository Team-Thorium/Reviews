/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
const { QueryTypes } = require('sequelize');
const _ = require('underscore');
const { readDb, Reviews, Photos, CharacteristicsReviews } = require('../db/db');

module.exports = {
  getAll: ({ page, count = 5, sort = 1, product_id }) => {
    page = page - 1 || 0;
    const offset = page * count;
    if (sort === 'newest') sort = 8;
    if (sort === 'helpful') sort = 10;

    return readDb.query(
      'SELECT * FROM reviews_view WHERE product_id = :product_id ORDER BY :sort DESC OFFSET :offset LIMIT :count',
      {
        replacements: { product_id, sort, offset, count },
        type: QueryTypes.SELECT,
      },
    );
  },

  postReview: ({
    product_id,
    rating,
    summary,
    body,
    recommend,
    name,
    email,
    photos,
    characteristics,
  }) => {
    try {
      return db.transaction((t) => (
        Reviews.create({
          product_id,
          rating,
          date: new Date(),
          summary,
          body,
          recommend,
          reported: false,
          response: null,
          reviewer_name: name,
          reviewer_email: email,
          helpfulness: 0,
        }, { transaction: t })
          .then((review) => {
            const promises = [];
            promises.push(Photos.bulkCreate(
              photos.map((photo) => ({ review_id: review.id, url: photo })),
              { transaction: t },
            ));
            promises.push(CharacteristicsReviews.bulkCreate(
              _.map(characteristics, (characteristicId) => (
                {
                  characteristic_id: characteristicId,
                  review_id: review.id,
                  value: characteristics[characteristicId],
                }
              )),
              { transaction: t },
            ));
            return Promise.all(promises);
          })
      ));
    } catch (err) {
      console.log('error creating new review', err);
    }
  },

  updateHelpful: (reviewId) => (
    Reviews.increment(
      { helpfulness: 1 },
      { where: { id: reviewId } },
    )
  ),

  report: (reviewId) => (
    Reviews.update(
      { reported: true },
      { where: { id: reviewId } },
    )
  ),
};
