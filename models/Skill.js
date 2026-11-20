const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { SKILL_CATEGORIES } = require('../config/constants');

const Skill = sequelize.define('Skill', {
  name: { type: DataTypes.STRING(100), allowNull: false },
  category: { type: DataTypes.STRING(60), allowNull: false, validate: { isIn: [SKILL_CATEGORIES] } },
  description: { type: DataTypes.STRING(250) },
  icon: { type: DataTypes.STRING(8) },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'skills' });

module.exports = Skill;
