const { QueryTypes } = require('sequelize');
const { db } = require('../db/db');

module.exports = {
  getMeta: (productId) => (
    db.query('SELECT * FROM meta_view WHERE product_id = ?', {
      replacements: [productId],
      type: QueryTypes.SELECT,
    })
  ),
};
