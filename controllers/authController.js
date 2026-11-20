const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.showLogin = (req, res) => res.render('admin/login', { title: 'Login Admin' });

exports.login = async (req, res, next) => {
  try {
    const { username = '', password = '' } = req.body;
    const user = await User.findOne({ where: { username: username.trim() } });
    const ok = user && (await bcrypt.compare(password, user.passwordHash));
    if (!ok) {
      req.session.flash = { type: 'error', msg: 'Username atau password salah.' };
      return res.redirect('/admin/login');
    }
    // Regenerasi session untuk mencegah session fixation
    req.session.regenerate((err) => {
      if (err) return next(err);
      req.session.userId = user.id;
      req.session.username = user.username;
      return res.redirect('/admin');
    });
  } catch (e) { next(e); }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
};

exports.showPassword = (req, res) => res.render('admin/password', { title: 'Ganti Password' });

exports.changePassword = async (req, res, next) => {
  try {
    const { current = '', next: newPass = '', confirm = '' } = req.body;
    const user = await User.findByPk(req.session.userId);
    if (!(await bcrypt.compare(current, user.passwordHash))) {
      req.session.flash = { type: 'error', msg: 'Password saat ini salah.' };
      return res.redirect('/admin/password');
    }
    if (newPass.length < 8 || newPass !== confirm) {
      req.session.flash = { type: 'error', msg: 'Password baru minimal 8 karakter dan harus sama dengan konfirmasi.' };
      return res.redirect('/admin/password');
    }
    user.passwordHash = await bcrypt.hash(newPass, 12);
    await user.save();
    req.session.flash = { type: 'success', msg: 'Password berhasil diganti.' };
    return res.redirect('/admin');
  } catch (e) { next(e); }
};
