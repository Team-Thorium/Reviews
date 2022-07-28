require('dotenv').config();
const _ = require('underscore');
const db = require('./db/db');
const express = require('express');
const app = express();

app.use(express.json());

app.get('/reviews', (req, res) => {
  const page = req.query.page || 0;
  const count = req.query.count || 5;
  const offset = page * count;
  const sortParam = req.query?.sort?.toLowerCase() || 'relevant';
  const sort = sortParam === 'newest' ? 'date' : sortParam === 'helpful' ? 'helpfulness' : 'recommend';
  const productId = req.query.product_id;

  db.query(`SELECT * FROM reviews_view WHERE product_id = ? ORDER BY ? DESC OFFSET ? LIMIT ?`, [productId, sort, offset, count])
    .then((results) => {
      console.log(results.rows);
      res.json({
        product: productId,
        page,
        count,
        results: results.rows,
      });
      res.end();
    })
    .catch(err => {
      console.log('error getting review data from database', err);
    })
});

app.get('/reviews/meta', (req, res) => {
  const productId = req.query.product_id;
  db.query(`SELECT * FROM meta_view WHERE product_id = $1`, [productId])
    .then((results) => {
      res.json(results.rows);
      res.end();
    })
    .catch((err) => {
      console.log('error getting meta data from database', err);
    })
});


app.post('/reviews', (req, res) => {
  const productId = req.body.product_id;
  const rating = req.body.rating;
  const summary = req.body.summary;
  const body = req.body.body;
  const recommend = req.body.recommend;
  const name = req.body.name;
  const email = req.body.email;
  const photos = req.body.photos;
  const characteristics = req.body.characteristics;

  db.query('')
  // insert statement into reviews RETURNING id
    // productId, rating, summary, body, recommend, name, email
    // with the new id,
      // iterate through photos
        // insert into photos with reviewId
      // iterate through characteristics (char_id: value)
        // insert into characteristics, char_id, reviewId, value
});

app.listen(process.env.PORT, () => {
  console.log('listening on port', process.env.PORT);
});
