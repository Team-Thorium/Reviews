const router = require('express').Router();
const controllers = require('./controllers');

router.get('/reviews', controllers.reviews.get);

router.get('/reviews/meta', controllers.meta.get);

router.post('/reviews', controllers.reviews.post);

router.put('/reviews/:review_id/helpful', controllers.reviews.putHelpful);

router.put('/reviews/:review_id/report', controllers.reviews.putReport);


module.exports = router;