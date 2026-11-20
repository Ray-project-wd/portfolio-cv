const fs = require('fs');
const path = require('path');

const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0] || '').join('').toUpperCase() || 'P';

const firstName = (name = '') => name.trim().split(/\s+/)[0] || '';

const splitTags = (str = '') => (str || '').split(',').map((s) => s.trim()).filter(Boolean);

const splitLines = (str = '') => (str || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean);

const period = (a, b) => [a, b].filter(Boolean).join(' – ');

// Hapus file upload (hanya di dalam /uploads/)
function removeUpload(rel) {
  if (!rel || !rel.startsWith('/uploads/')) return;
  const full = path.join(__dirname, '..', 'public', rel);
  if (!full.startsWith(path.join(__dirname, '..', 'public', 'uploads'))) return;
  fs.promises.unlink(full).catch(() => {});
}

module.exports = { initials, firstName, splitTags, splitLines, period, removeUpload };
