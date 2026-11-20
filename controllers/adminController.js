const { Profile, Project, Certificate, Skill, Education, Experience, Organization } = require('../models');
const { profileFields } = require('../config/resources');
const { removeUpload } = require('../utils/helpers');

const getProfile = async () => (await Profile.findOne()) || Profile.create({});

const relPath = (cfg, file) => `/uploads/${cfg.folder}/${file.filename}`;

// Ambil nilai form → objek data (tanpa field file)
function pick(fields, body) {
  const data = {};
  fields.forEach((f) => {
    if (f.type === 'file') return;
    let v = typeof body[f.name] === 'string' ? body[f.name].trim() : body[f.name];
    if (v === '' || v === undefined) v = null;
    if (f.type === 'number' && v !== null) {
      v = parseInt(v, 10);
      if (Number.isNaN(v)) v = null;
    }
    data[f.name] = v;
  });
  if ('sortOrder' in data && data.sortOrder === null) data.sortOrder = 0;
  return data;
}

function validate(fields, data, file, isNew) {
  const errors = [];
  fields.forEach((f) => {
    if (f.required) {
      if (f.type === 'file') {
        if (isNew && !file) errors.push(`${f.label} wajib diunggah.`);
      } else if (data[f.name] === null || data[f.name] === undefined) {
        errors.push(`${f.label} wajib diisi.`);
      }
    }
    if (f.type === 'url' && data[f.name] && !/^https?:\/\/\S+$/i.test(data[f.name])) {
      errors.push(`${f.label} harus diawali http:// atau https://`);
    }
    if (f.type === 'number' && data[f.name] !== null && data[f.name] !== undefined && data[f.name] < 0) {
      errors.push(`${f.label} tidak boleh negatif.`);
    }
  });
  const gpa = data.gpa;
  if (fields.some((f) => f.name === 'gpa' && f.label === 'IPK') && gpa && Number.isNaN(Number(gpa)) && !/\//.test(gpa)) {
    errors.push('IPK harus berupa angka.');
  }
  return errors;
}

// ---------- Dashboard ----------
exports.dashboard = async (req, res, next) => {
  try {
    const [projects, certificates, skills, education, experience, organizations] = await Promise.all([
      Project.count(), Certificate.count(), Skill.count(),
      Education.count(), Experience.count(), Organization.count(),
    ]);
    const profile = await Profile.findOne();
    res.render('admin/dashboard', {
      title: 'Dashboard', profile,
      counts: { projects, certificates, skills, education, experience, organizations },
    });
  } catch (e) { next(e); }
};

// ---------- Profil ----------
exports.showProfile = async (req, res, next) => {
  try {
    const profile = await getProfile();
    res.render('admin/form', {
      title: 'Edit Profil', fields: profileFields, item: profile.toJSON(),
      errors: [], action: '/admin/profile', backUrl: '/admin',
    });
  } catch (e) { next(e); }
};

exports.saveProfile = async (req, res, next) => {
  try {
    const profile = await getProfile();
    const data = pick(profileFields, req.body);
    if (data.fullName === null) data.fullName = 'Nama Lengkap';
    const errors = validate(profileFields, data, req.file, false);
    if (data.gpa !== null && (Number.isNaN(Number(data.gpa)) || Number(data.gpa) < 0 || Number(data.gpa) > 4)) {
      errors.push('IPK harus angka antara 0 dan 4.');
    }
    if (errors.length) {
      if (req.file) removeUpload(`/uploads/photos/${req.file.filename}`);
      return res.status(422).render('admin/form', {
        title: 'Edit Profil', fields: profileFields, item: { ...profile.toJSON(), ...data },
        errors, action: '/admin/profile', backUrl: '/admin',
      });
    }
    if (req.file) {
      removeUpload(profile.photo);
      data.photo = `/uploads/photos/${req.file.filename}`;
    }
    await profile.update(data);
    req.session.flash = { type: 'success', msg: 'Profil berhasil disimpan.' };
    return res.redirect('/admin/profile');
  } catch (e) { next(e); }
};

// ---------- CRUD generik ----------
exports.list = (cfg, key) => async (req, res, next) => {
  try {
    const rows = await cfg.model.findAll({ order: [['sortOrder', 'ASC'], ['id', 'ASC']] });
    res.render('admin/list', { title: cfg.plural, cfg, key, rows });
  } catch (e) { next(e); }
};

exports.newForm = (cfg, key) => (req, res) => {
  res.render('admin/form', {
    title: `Tambah ${cfg.label}`, fields: cfg.fields, item: { sortOrder: 0 }, errors: [],
    action: `/admin/${key}`, backUrl: `/admin/${key}`,
  });
};

exports.create = (cfg, key) => async (req, res, next) => {
  try {
    const data = pick(cfg.fields, req.body);
    const errors = validate(cfg.fields, data, req.file, true);
    if (errors.length) {
      if (req.file) removeUpload(relPath(cfg, req.file));
      return res.status(422).render('admin/form', {
        title: `Tambah ${cfg.label}`, fields: cfg.fields, item: data, errors,
        action: `/admin/${key}`, backUrl: `/admin/${key}`,
      });
    }
    const profile = await getProfile();
    data.ProfileId = profile.id;
    if (req.file) data[cfg.fileField] = relPath(cfg, req.file);
    await cfg.model.create(data);
    req.session.flash = { type: 'success', msg: `${cfg.label} berhasil ditambahkan.` };
    return res.redirect(`/admin/${key}`);
  } catch (e) { next(e); }
};

exports.editForm = (cfg, key) => async (req, res, next) => {
  try {
    const item = await cfg.model.findByPk(req.params.id);
    if (!item) return res.status(404).render('404', { title: 'Tidak ditemukan' });
    return res.render('admin/form', {
      title: `Edit ${cfg.label}`, fields: cfg.fields, item: item.toJSON(), errors: [],
      action: `/admin/${key}/${item.id}`, backUrl: `/admin/${key}`,
    });
  } catch (e) { next(e); }
};

exports.update = (cfg, key) => async (req, res, next) => {
  try {
    const item = await cfg.model.findByPk(req.params.id);
    if (!item) return res.status(404).render('404', { title: 'Tidak ditemukan' });
    const data = pick(cfg.fields, req.body);
    const errors = validate(cfg.fields, data, req.file, false);
    if (errors.length) {
      if (req.file) removeUpload(relPath(cfg, req.file));
      return res.status(422).render('admin/form', {
        title: `Edit ${cfg.label}`, fields: cfg.fields, item: { ...item.toJSON(), ...data }, errors,
        action: `/admin/${key}/${item.id}`, backUrl: `/admin/${key}`,
      });
    }
    if (req.file) {
      removeUpload(item[cfg.fileField]);
      data[cfg.fileField] = relPath(cfg, req.file);
    }
    await item.update(data);
    req.session.flash = { type: 'success', msg: `${cfg.label} berhasil diperbarui.` };
    return res.redirect(`/admin/${key}`);
  } catch (e) { next(e); }
};

exports.destroy = (cfg, key) => async (req, res, next) => {
  try {
    const item = await cfg.model.findByPk(req.params.id);
    if (item) {
      if (cfg.fileField) removeUpload(item[cfg.fileField]);
      await item.destroy();
      req.session.flash = { type: 'success', msg: `${cfg.label} berhasil dihapus.` };
    }
    return res.redirect(`/admin/${key}`);
  } catch (e) { next(e); }
};
