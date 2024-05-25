const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contact = sequelize.define('contact', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  linkedId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'contact', // refers to table name
      key: 'id', // 'id' refers to column name in contact table
    },
  },
  linkPrecedence: {
    type: DataTypes.ENUM,
    values: ['primary', 'secondary'],
    defaultValue: 'primary',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'contact',
  timestamps: true, // automatically creates 'createdAt' and 'updatedAt'
  paranoid: true, // automatically handle 'deletedAt' for soft delete
});

module.exports = Contact;
