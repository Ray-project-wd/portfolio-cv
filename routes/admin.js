const express = require('express');
const { requireAuth, redirectIfAuth } = require('../middleware/auth');
const { makeUpload } = require('../middleware/upload');
const auth = require('../controllers/authController');
const admin = require('../controllers/adminController');
const { resources } = require('../config/resources');

const router = express.Router();

// Auth
router.get('/login', redirectIfAuth, auth.showLogin);
router.post('/login', redirectIfAuth, auth.login);
router.post('/logout', requireAuth, auth.logout);

// Semua route di bawah ini wajib login
router.use(requireAuth);
router.get('/', admin.dashboard);
router.get('/password', auth.showPassword);
router.post('/password', auth.changePassword);

// Profil (dengan upload foto)
router.get('/profile', admin.showProfile);
router.post('/profile', makeUpload('photos', 'photo'), admin.saveProfile);

// CRUD generik untuk setiap resource
Object.entries(resources).forEach(([key, cfg]) => {
  const upload = cfg.fileField ? [makeUpload(cfg.folder, cfg.fileField)] : [];
  router.get(`/${key}`, admin.list(cfg, key));
  router.get(`/${key}/new`, admin.newForm(cfg, key));
  router.post(`/${key}`, ...upload, admin.create(cfg, key));
  router.get(`/${key}/:id(\\d+)/edit`, admin.editForm(cfg, key));
  router.post(`/${key}/:id(\\d+)`, ...upload, admin.update(cfg, key));
  router.post(`/${key}/:id(\\d+)/delete`, admin.destroy(cfg, key));
});

module.exports = router;
