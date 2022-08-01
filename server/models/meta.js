const { db } = require('../db/db');
const { QueryTypes } = require('sequelize');

module.exports = {
  getMeta: (product_id) => {
    return db.query(`SELECT * FROM meta_view WHERE product_id = ?`, {
      replacements: [product_id],
      type: QueryTypes.SELECT
    })
  }
}