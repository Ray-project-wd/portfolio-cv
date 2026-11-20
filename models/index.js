const sequelize = require('../config/database');
const User = require('./User');
const Profile = require('./Profile');
const Education = require('./Education');
const Experience = require('./Experience');
const Organization = require('./Organization');
const Skill = require('./Skill');
const Project = require('./Project');
const Certificate = require('./Certificate');

// User 1 — 1 Profile ; Profile 1 — N (semua data portofolio)
User.hasOne(Profile, { foreignKey: 'UserId', onDelete: 'CASCADE' });
Profile.belongsTo(User, { foreignKey: 'UserId' });

const children = [Education, Experience, Organization, Skill, Project, Certificate];
children.forEach((Model) => {
  Profile.hasMany(Model, { foreignKey: 'ProfileId', onDelete: 'CASCADE' });
  Model.belongsTo(Profile, { foreignKey: 'ProfileId' });
});

module.exports = {
  sequelize, User, Profile, Education, Experience, Organization, Skill, Project, Certificate,
};
