require('dotenv').config();

const { Sequelize } = require('sequelize');

const {
  DB_NAME = 'identity_reconciliation',
  DB_USER = 'root',
  DB_PASSWORD = 'Rohit@2112',
  DB_HOST = 'localhost',
  DB_PORT = '3306',
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST || 'localhost',
  port: DB_PORT || 3306,
  dialect: 'mysql',
  logging: console.log, // Enable logging in development, can be set to false in production via .env
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true, // If you prefer all your models to have timestamps
    paranoid: true, // If you prefer all your models to have soft delete
  },
  retry: {
    max: 3, // Set the number of retries on a new connection
  },
});

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});

module.exports = sequelize;
