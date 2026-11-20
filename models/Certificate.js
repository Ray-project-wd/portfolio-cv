const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Certificate = sequelize.define('Certificate', {
  title: { type: DataTypes.STRING(200), allowNull: false },
  issuer: { type: DataTypes.STRING(150), allowNull: false },
  issueDate: { type: DataTypes.STRING(30) },
  credentialUrl: { type: DataTypes.STRING(300) },
  image: { type: DataTypes.STRING(250), allowNull: false },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'certificates' });

module.exports = Certificate;
