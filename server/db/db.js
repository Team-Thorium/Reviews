/* eslint-disable no-console */
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const database = process.env.PGDATABASE;
const user = process.env.PGUSER;
const password = process.env.PG_PASSWORD;

const sequelize = new Sequelize(database, user, password, {
  host: process.env.PG_WRITE_HOST,
  dialect: 'postgres',
  define: {
    timestamps: false,
  },
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

const Reviews = sequelize.define('reviews', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  product_id: DataTypes.INTEGER,
  rating: DataTypes.INTEGER,
  date: DataTypes.DATE,
  summary: DataTypes.STRING,
  body: DataTypes.STRING,
  recommend: DataTypes.BOOLEAN,
  reported: DataTypes.BOOLEAN,
  reviewer_name: DataTypes.STRING,
  reviewer_email: DataTypes.STRING,
  response: DataTypes.STRING,
  helpfulness: DataTypes.INTEGER,
});

const Photos = sequelize.define('photos', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  review_id: DataTypes.INTEGER,
  url: DataTypes.STRING,
});

// const Characteristics = sequelize.define('Characteristics', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//   },
//   product_id: DataTypes.INTEGER,
//   name: DataTypes.STRING,
// })

const CharacteristicsReviews = sequelize.define('characteristics_reviews', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  characteristic_id: DataTypes.INTEGER,
  review_id: DataTypes.INTEGER,
  value: DataTypes.INTEGER,
});

const replica = new Sequelize(database, user, password, {
  host: process.env.PG_READ_HOST,
  dialect: 'postgres',
  define: {
    timestamps: false,
  },
});

replica.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = {
  writeDb: sequelize,
  readDb: replica,
  Reviews,
  Photos,
  CharacteristicsReviews,
};
