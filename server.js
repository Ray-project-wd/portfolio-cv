require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const { sequelize } = require('./models');
const helpers = require('./utils/helpers');
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

if (isProd) app.set('trust proxy', 1);
app.disable('x-powered-by');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
Object.assign(app.locals, helpers);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(session({
  name: 'portfolio.sid',
  secret: process.env.SESSION_SECRET || 'dev-secret-ubah-di-produksi',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: 'auto', maxAge: 1000 * 60 * 60 * 8 },
}));

// Flash message + info admin untuk semua view
app.use((req, res, next) => {
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  res.locals.admin = req.session.userId ? { username: req.session.username } : null;
  next();
});

app.use('/admin', adminRoutes);
app.use('/', publicRoutes);

app.use((req, res) => res.status(404).render('404', { title: 'Halaman tidak ditemukan' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('500', { title: 'Terjadi kesalahan' });
});

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => sequelize.sync())
  .then(() => app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('Gagal terhubung ke database:', err.message);
    process.exit(1);
  });
