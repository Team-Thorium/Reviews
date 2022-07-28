require('dotenv').config();
const { db, Reviews, Photos, Characteristics_reviews } = require('./db/db');
const { QueryTypes } = require('sequelize');
const express = require('express');
const app = express();

app.use(express.json());

app.get('/reviews', (req, res) => {
  const page = Number(req.query.page) || 0;
  const count = Number(req.query.count) || 5;
  const offset = page * count;
  const sortParam = req.query?.sort?.toLowerCase() || 'relevant';
  const sort = sortParam === 'newest' ? 8 : sortParam === 'helpful' ? 10 : 5;
  const productId = Number(req.query.product_id);

  db.query('SELECT * FROM reviews_view WHERE product_id = ? ORDER BY ? DESC OFFSET ? LIMIT ?',
  {
    replacements: [productId, sort, offset, count],
    type: QueryTypes.SELECT
  })
    .then((results) => {
      res.json({
        product: productId,
        page,
        count,
        results: results,
      });
      res.end();
    })
    .catch(err => {
      console.log('error getting review data from database', err);
    })
});

app.get('/reviews/meta', (req, res) => {
  const productId = req.query.product_id;
  db.query(`SELECT * FROM meta_view WHERE product_id = ?`, {
    replacements: [productId],
    type: QueryTypes.SELECT
  })
    .then((results) => {
      res.json(results);
      res.end();
    })
    .catch((err) => {
      console.log('error getting meta data from database', err);
    })
});


app.post('/reviews', (req, res) => {
  console.log(req.body);
  const productId = req.body.product_id;
  const rating = req.body.rating;
  const summary = req.body.summary;
  const body = req.body.body;
  const recommend = req.body.recommend;
  const name = req.body.name;
  const email = req.body.email;
  const photos = req.body.photos;
  const characteristics = req.body.characteristics;

  console.log(rating);
  async function create() {
    try {
      const result = await db.transaction(async (t) => {
        const review = await Reviews.create({
          product_id: productId,
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
        }, { transaction: t });

        for (const photo of photos) {
          const photoRes = await Photos.create({
            review_id: review.id,
            url: photo,
          }, { transaction: t });
        }

        for (const characteristic_id in characteristics) {
          const char = await Characteristics_reviews.create({
            characteristic_id,
            review_id: review.id,
            value: characteristics[characteristic_id],
          }, { transaction: t });
        }
      })
      res.sendStatus(201);
    } catch (err) {
      console.log('error creating new review', err);
    }
  }
  create();
});

app.listen(process.env.PORT, () => {
  console.log('listening on port', process.env.PORT);
});
