const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const ALLOWED = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

// Membuat middleware upload satu file ke public/uploads/<folder>
function makeUpload(folder, fieldName) {
  const storage = multer.diskStorage({
    destination: path.join(__dirname, '..', 'public', 'uploads', folder),
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ALLOWED[file.mimetype]}`);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (req, file, cb) => {
      if (ALLOWED[file.mimetype]) return cb(null, true);
      return cb(new Error('Format gambar harus JPG, PNG, atau WEBP.'));
    },
  }).single(fieldName);

  // Tangkap error multer agar tidak menjadi halaman error mentah
  return (req, res, next) => {
    upload(req, res, (err) => {
      if (!err) return next();
      const msg = err.code === 'LIMIT_FILE_SIZE' ? 'Ukuran gambar maksimal 5 MB.' : err.message;
      req.session.flash = { type: 'error', msg };
      return res.redirect('back');
    });
  };
}

module.exports = { makeUpload };
