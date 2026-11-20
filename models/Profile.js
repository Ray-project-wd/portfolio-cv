const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Profile = sequelize.define('Profile', {
  fullName: { type: DataTypes.STRING(120), allowNull: false, defaultValue: 'Nama Lengkap' },
  headline: { type: DataTypes.STRING(200) },
  headlineEn: { type: DataTypes.STRING(200) },
  summary: { type: DataTypes.TEXT },
  summaryEn: { type: DataTypes.TEXT },
  educationStatus: { type: DataTypes.STRING(150) },
  university: { type: DataTypes.STRING(150) },
  gpa: { type: DataTypes.DECIMAL(3, 2), validate: { min: 0, max: 4 } },
  graduationYear: { type: DataTypes.INTEGER },
  learningStartYear: { type: DataTypes.INTEGER },
  expertise: { type: DataTypes.STRING(150) },
  expertiseNote: { type: DataTypes.STRING(200) },
  featuredSkillTitle: { type: DataTypes.STRING(120) },
  featuredSkillDesc: { type: DataTypes.TEXT },
  featuredSkillTag: { type: DataTypes.STRING(120) },
  quote: { type: DataTypes.TEXT },
  email: { type: DataTypes.STRING(150) },
  phone: { type: DataTypes.STRING(40) },
  location: { type: DataTypes.STRING(120) },
  github: { type: DataTypes.STRING(250) },
  linkedin: { type: DataTypes.STRING(250) },
  photo: { type: DataTypes.STRING(250) },
});

module.exports = Profile;
