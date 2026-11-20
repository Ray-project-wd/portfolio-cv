const {
  Education, Experience, Organization, Skill, Project, Certificate,
} = require('../models');
const { SKILL_CATEGORIES } = require('./constants');

const order = { name: 'sortOrder', label: 'Urutan tampil', type: 'number', help: 'Angka kecil tampil lebih dulu (default 0).' };

// Konfigurasi form + tabel untuk semua resource CRUD admin
const resources = {
  education: {
    model: Education, label: 'Pendidikan', plural: 'Pendidikan',
    columns: ['institution', 'program', 'endYear'],
    fields: [
      { name: 'institution', label: 'Nama universitas / sekolah', type: 'text', required: true },
      { name: 'program', label: 'Program studi', type: 'text', required: true },
      { name: 'startYear', label: 'Tahun masuk', type: 'number' },
      { name: 'endYear', label: 'Tahun lulus', type: 'text', help: 'Contoh: 2027 atau Sekarang' },
      { name: 'gpa', label: 'IPK', type: 'text', help: 'Contoh: 3.85/4.00' },
      { name: 'achievements', label: 'Pencapaian akademik', type: 'textarea', help: 'Satu pencapaian per baris.' },
      order,
    ],
  },
  experience: {
    model: Experience, label: 'Pengalaman', plural: 'Pengalaman',
    columns: ['position', 'company', 'startDate'],
    fields: [
      { name: 'position', label: 'Posisi', type: 'text', required: true },
      { name: 'company', label: 'Perusahaan / organisasi', type: 'text', required: true },
      { name: 'startDate', label: 'Mulai', type: 'text', help: 'Contoh: Jan 2025' },
      { name: 'endDate', label: 'Selesai', type: 'text', help: 'Contoh: Jun 2025 atau Sekarang' },
      { name: 'description', label: 'Deskripsi pekerjaan', type: 'textarea', help: 'Satu poin per baris.' },
      { name: 'achievements', label: 'Hasil / pencapaian', type: 'textarea', help: 'Satu poin per baris.' },
      order,
    ],
  },
  organization: {
    model: Organization, label: 'Organisasi', plural: 'Organisasi',
    columns: ['position', 'name', 'startDate'],
    fields: [
      { name: 'position', label: 'Jabatan', type: 'text', required: true },
      { name: 'name', label: 'Nama organisasi', type: 'text', required: true },
      { name: 'startDate', label: 'Mulai', type: 'text' },
      { name: 'endDate', label: 'Selesai', type: 'text' },
      { name: 'description', label: 'Deskripsi kegiatan', type: 'textarea', help: 'Satu poin per baris.' },
      { name: 'achievements', label: 'Hasil / pencapaian', type: 'textarea', help: 'Satu poin per baris.' },
      order,
    ],
  },
  skills: {
    model: Skill, label: 'Skill', plural: 'Skills',
    columns: ['name', 'category'],
    fields: [
      { name: 'name', label: 'Nama skill', type: 'text', required: true },
      { name: 'category', label: 'Kategori', type: 'select', required: true, options: SKILL_CATEGORIES },
      { name: 'description', label: 'Deskripsi singkat', type: 'text' },
      { name: 'icon', label: 'Ikon (emoji / 1-2 huruf)', type: 'text', max: 8 },
      order,
    ],
  },
  projects: {
    model: Project, label: 'Proyek', plural: 'Proyek',
    columns: ['title', 'year', 'technologies'],
    folder: 'projects', fileField: 'thumbnail',
    fields: [
      { name: 'title', label: 'Nama proyek', type: 'text', required: true },
      { name: 'description', label: 'Deskripsi singkat', type: 'textarea', required: true },
      { name: 'technologies', label: 'Teknologi', type: 'text', help: 'Pisahkan dengan koma. Contoh: Node.js, PostgreSQL, EJS' },
      { name: 'year', label: 'Tahun', type: 'number' },
      { name: 'githubUrl', label: 'Link GitHub', type: 'url' },
      { name: 'demoUrl', label: 'Link live demo', type: 'url' },
      { name: 'details', label: 'Detail proyek', type: 'textarea', help: 'Tampil di halaman detail proyek.' },
      { name: 'thumbnail', label: 'Thumbnail', type: 'file' },
      order,
    ],
  },
  certificates: {
    model: Certificate, label: 'Sertifikat', plural: 'Sertifikat',
    columns: ['title', 'issuer', 'issueDate'],
    folder: 'certificates', fileField: 'image',
    fields: [
      { name: 'title', label: 'Nama sertifikat', type: 'text', required: true },
      { name: 'issuer', label: 'Penyelenggara', type: 'text', required: true },
      { name: 'issueDate', label: 'Tanggal terbit', type: 'text', help: 'Contoh: Agu 2026' },
      { name: 'credentialUrl', label: 'Link kredensial', type: 'url' },
      { name: 'image', label: 'Gambar sertifikat', type: 'file', required: true },
      order,
    ],
  },
};

const profileFields = [
  { name: 'fullName', label: 'Nama lengkap', type: 'text', required: true },
  { name: 'photo', label: 'Foto profil', type: 'file', help: 'Terbaik PNG/WEBP dengan latar transparan (cutout) agar menyatu dengan tulisan PORTFOLIO.' },
  { name: 'headline', label: 'Headline (ID)', type: 'text', help: 'Contoh: Building Digital Experiences.' },
  { name: 'headlineEn', label: 'Headline (EN)', type: 'text' },
  { name: 'educationStatus', label: 'Status pendidikan', type: 'text', help: 'Contoh: Mahasiswa S1 Teknik Informatika' },
  { name: 'university', label: 'Universitas', type: 'text' },
  { name: 'gpa', label: 'IPK', type: 'text', help: 'Skala 4.00, contoh: 3.85' },
  { name: 'graduationYear', label: 'Tahun kelulusan', type: 'number' },
  { name: 'learningStartYear', label: 'Mulai belajar IT (tahun)', type: 'number', help: 'Dipakai menghitung statistik "Years of Learning".' },
  { name: 'summary', label: 'Professional summary (ID)', type: 'textarea' },
  { name: 'summaryEn', label: 'Professional summary (EN)', type: 'textarea' },
  { name: 'expertise', label: 'Bidang keahlian', type: 'text', help: 'Contoh: Web Development & Backend' },
  { name: 'expertiseNote', label: 'Keterangan bidang keahlian', type: 'text' },
  { name: 'featuredSkillTitle', label: 'Kartu keahlian utama: judul', type: 'text' },
  { name: 'featuredSkillTag', label: 'Kartu keahlian utama: label', type: 'text' },
  { name: 'featuredSkillDesc', label: 'Kartu keahlian utama: deskripsi', type: 'textarea' },
  { name: 'quote', label: 'Kutipan pribadi', type: 'textarea' },
  { name: 'email', label: 'Email', type: 'text' },
  { name: 'phone', label: 'Telepon', type: 'text' },
  { name: 'location', label: 'Lokasi', type: 'text' },
  { name: 'github', label: 'GitHub (URL)', type: 'url' },
  { name: 'linkedin', label: 'LinkedIn (URL)', type: 'url' },
];

module.exports = { resources, profileFields };
