function requireAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  req.session.flash = { type: 'error', msg: 'Silakan login terlebih dahulu.' };
  return res.redirect('/admin/login');
}

function redirectIfAuth(req, res, next) {
  if (req.session && req.session.userId) return res.redirect('/admin');
  return next();
}

module.exports = { requireAuth, redirectIfAuth };
