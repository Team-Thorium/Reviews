const { db, Reviews, Photos, Characteristics_reviews } = require('../db/db');
const { QueryTypes } = require('sequelize');

module.exports = {
  getAll: ({ page, count = 5, sort, product_id }) => {
    page = page - 1 || 0;
    const offset = page * count;
    sort = sort === 'newest' ? 8 : sort === 'helpful' ? 10 : 1;

    return db.query('SELECT * FROM reviews_view WHERE product_id = :product_id ORDER BY :sort DESC OFFSET :offset LIMIT :count',
    {
      replacements: { product_id, sort, offset, count },
      type: QueryTypes.SELECT
    });
  },

  postReview: ( { product_id, rating, summary, body, recommend, name, email, photos, characteristics } ) => {

    async function create() {
      try {
        const result = await db.transaction(async (t) => {
          const review = await Reviews.create({
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
        });
      } catch (err) {
        console.log('error creating new review', err);
      }
    }
    return create();
  },

  updateHelpful: ( review_id ) => {
    return Reviews.increment(
      { helpfulness: 1 },
      { where: { id: review_id }}
    )
  },

  report: ( review_id ) => {
    return Reviews.update(
      { reported: true },
      { where: { id: review_id }}
    )
  }
}