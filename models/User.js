const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
});

module.exports = User;
