const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Experience = sequelize.define('Experience', {
  position: { type: DataTypes.STRING(150), allowNull: false },
  company: { type: DataTypes.STRING(150), allowNull: false },
  startDate: { type: DataTypes.STRING(30) },
  endDate: { type: DataTypes.STRING(30) },
  description: { type: DataTypes.TEXT },
  achievements: { type: DataTypes.TEXT },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'experiences' });

module.exports = Experience;
