const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Education = sequelize.define('Education', {
  institution: { type: DataTypes.STRING(150), allowNull: false },
  program: { type: DataTypes.STRING(150), allowNull: false },
  startYear: { type: DataTypes.INTEGER },
  endYear: { type: DataTypes.STRING(20) },
  gpa: { type: DataTypes.STRING(20) },
  achievements: { type: DataTypes.TEXT },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'educations' });

module.exports = Education;
