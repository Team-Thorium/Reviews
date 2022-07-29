let request = require('supertest');
const assert = require('assert');
const app = require('../index.js');
// request = request.bind(request, );

describe('GET /reviews', function() {
  it('responds with status 200 and a json object', function(done) {
    request(app)
      .get('/reviews')
      .query({ product_id: 1 })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, done);
  });

  it('responds with correct data', function(done) {
    request(app)
      .get('/reviews')
      .query({ product_id: 1 })
      .expect(function(res) {
        assert(res.body.hasOwnProperty('product'));
        assert(res.body.hasOwnProperty('page'));
        assert(res.body.hasOwnProperty('count'));
        assert(res.body.hasOwnProperty('results'));
      })
      .expect(function(res) {
        if (res.body.results.length > 0) {
          assert(res.body.results[0].hasOwnProperty('review_id'))
          assert(res.body.results[0].hasOwnProperty('product_id'))
          assert(res.body.results[0].hasOwnProperty('rating'))
          assert(res.body.results[0].hasOwnProperty('summary'))
          assert(res.body.results[0].hasOwnProperty('recommend'))
          assert(res.body.results[0].hasOwnProperty('response'))
          assert(res.body.results[0].hasOwnProperty('body'))
          assert(res.body.results[0].hasOwnProperty('date'))
          assert(res.body.results[0].hasOwnProperty('reviewer_name'))
          assert(res.body.results[0].hasOwnProperty('helpfulness'))
          assert(res.body.results[0].hasOwnProperty('photos'))
        }
        done()
      })
      .end(function(err, res) {
        if (err) throw err;
      });
  })
});

describe('GET /reviews/meta', function() {
  it('responds with status 200 and a json object', function(done) {
    // will have to optimize query to be below default timeout of 2000ms,
    // and delete code below
    this.timeout(10000);
    request(app)
      .get('/reviews/meta')
      .query({ product_id: 1 })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, done);
  });

  it('responds with correct data', function(done) {
    // will have to optimize query to be below default timeout of 2000ms,
    // and delete code below
    this.timeout(10000);
    request(app)
      .get('/reviews/meta')
      .query({ product_id: 1 })
      .expect(function(res) {
        assert(res.body[0].hasOwnProperty('product_id'));
        assert(res.body[0].hasOwnProperty('ratings'));
        assert(res.body[0].hasOwnProperty('recommended'));
        assert(res.body[0].hasOwnProperty('characteristics'));
      })
      .expect(function(res) {
        assert(res.body[0].ratings.hasOwnProperty('1'));
        assert(res.body[0].ratings.hasOwnProperty('2'));
        assert(res.body[0].ratings.hasOwnProperty('3'));
        assert(res.body[0].ratings.hasOwnProperty('4'));
        assert(res.body[0].ratings.hasOwnProperty('5'));
        assert(res.body[0].recommended.hasOwnProperty('false'));
        assert(res.body[0].recommended.hasOwnProperty('true'));
        for (let charKeys in res.body[0].characteristics) {
          assert(res.body[0].characteristics[charKeys].hasOwnProperty('id'));
          assert(res.body[0].characteristics[charKeys].hasOwnProperty('value'));
        }
        done()
      })
      .end(function(err, res) {
        if (err) throw err;
      });
  })
});

describe('POST /reviews', function() {
  it('Successfully posts a review and is able to retrieve it', function(done) {
    const data = {
      product_id: 1,
      rating: 1,
      summary: 'test review',
      body: 'this is for testing purposes',
      recommend: true,
      name: 'testuser',
      email: 'testuser@gmail.com',
      photos: [],
      characteristics: {"1" : 3, "2" : 4, "3": 5, "4": 2},
    };

    request(app)
      .post('/reviews')
      .send(data)
      .expect(201)
      .catch((err) => {
        console.log('error posting reviews', err);
        done()
      });

    request(app)
      .get('/reviews')
      .query({ product_id: 1, sort: 'newest' })
      .expect(function(res) {
        assert.equal(res.body.results[0].rating, 1)
        assert.equal(res.body.results[0].summary, 'test review')
        assert.equal(res.body.results[0].body, 'this is for testing purposes')
        assert.equal(res.body.results[0].reviewer_name, 'testuser')
        done()
      })
      .catch((err) => {
        console.log('error posting reviews', err);
        done()
      });
  })
});

describe('PUT /reviews/:review_id/helpful', function() {
  it('Successfully updates helpful count', function(done) {
    this.timeout(10000);
    const targetId = 5774959;
    let initialState;
    request(app)
      .get('/reviews')
      .query({ product_id: 1, sort: 'newest', count: 100 })
      .then((res) => {
        res.body.results.forEach(result => {
          if (result.review_id === targetId) {
            initialState = result.helpfulness;
          }
        });
      })
      .catch((err) => {
        console.log('error getting helpful count', err);
        done();
      })


      request(app)
      .put(`/reviews/${targetId}/helpful`)
      .expect(204)
      .catch((err) => {
        console.log('error putting helpful count', err);
        done();
      })

      request(app)
      .get('/reviews')
      .query({ product_id: 1, sort: 'newest', count: 100 })
      .expect(function(res) {
        let afterState;
        res.body.results.forEach(result => {
          if (result.review_id === targetId) {
            afterState = result.helpfulness;
          }
        });
        assert.equal(afterState, Number(initialState) + 1);
        done()
      })
      .catch((err) => {
        console.log('error getting helpful count2', err);
        done();
      })

    })
});

describe('PUT /reviews/:review_id/report', function() {
  it('gets status 204 upon put', function(done) {
    const targetId = 5774975;
    let initialState;

      request(app)
      .put(`/reviews/${targetId}/report`)
      .expect(204)
      .end(function(err, res) {
        if (err) throw err;
        done()
      });
    })
});