const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  title: { type: DataTypes.STRING(150), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  details: { type: DataTypes.TEXT },
  technologies: { type: DataTypes.STRING(300) },
  year: { type: DataTypes.INTEGER },
  githubUrl: { type: DataTypes.STRING(300) },
  demoUrl: { type: DataTypes.STRING(300) },
  thumbnail: { type: DataTypes.STRING(250) },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'projects' });

module.exports = Project;
