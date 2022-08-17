const { QueryTypes } = require('sequelize');
const { readDb } = require('../db/db');

module.exports = {
  getMeta: (productId) => (
    readDb.query('SELECT * FROM meta_view WHERE product_id = ?', {
      replacements: [productId],
      type: QueryTypes.SELECT,
    })
  ),
};
