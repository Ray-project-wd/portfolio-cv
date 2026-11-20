const {
  Profile, Education, Experience, Organization, Skill, Project, Certificate,
} = require('../models');
const { SKILL_CATEGORIES } = require('../config/constants');
const { period, splitLines } = require('../utils/helpers');

const order = [['sortOrder', 'ASC'], ['id', 'ASC']];

exports.home = async (req, res, next) => {
  try {
    const profile = (await Profile.findOne()) || (await Profile.create({}));
    const [education, experience, organizations, skills, projects, certificates] = await Promise.all([
      Education.findAll({ order }), Experience.findAll({ order }), Organization.findAll({ order }),
      Skill.findAll({ order }), Project.findAll({ order }), Certificate.findAll({ order }),
    ]);

    const skillGroups = SKILL_CATEGORIES
      .map((category) => ({ category, items: skills.filter((s) => s.category === category) }))
      .filter((g) => g.items.length);

    const yearsLearning = profile.learningStartYear
      ? Math.max(0, new Date().getFullYear() - profile.learningStartYear) : 0;

    // Statistik dihitung dari database
    const stats = {
      projects: projects.length,
      certificates: certificates.length,
      years: yearsLearning,
      technologies: skills.length,
    };

    const timelines = {
      education: education.map((e) => ({
        title: e.program, org: e.institution,
        period: period(e.startYear, e.endYear),
        meta: e.gpa ? `IPK ${e.gpa}` : '', lines: splitLines(e.achievements), extra: [],
      })),
      experience: experience.map((e) => ({
        title: e.position, org: e.company, period: period(e.startDate, e.endDate),
        meta: '', lines: splitLines(e.description), extra: splitLines(e.achievements),
      })),
      organizations: organizations.map((o) => ({
        title: o.position, org: o.name, period: period(o.startDate, o.endDate),
        meta: '', lines: splitLines(o.description), extra: splitLines(o.achievements),
      })),
    };

    res.render('index', {
      title: `${profile.fullName} — Portfolio`, profile, stats, timelines,
      skillGroups, projects, certificates,
    });
  } catch (e) { next(e); }
};

exports.project = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).render('404', { title: 'Tidak ditemukan' });
    const profile = (await Profile.findOne()) || (await Profile.create({}));
    return res.render('project', { title: `${project.title} — ${profile.fullName}`, project, profile });
  } catch (e) { next(e); }
};
