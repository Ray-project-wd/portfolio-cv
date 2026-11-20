# Personal Portfolio & Professional CV

Website portofolio + CV dengan dashboard admin.
Stack: **Node.js + Express**, **EJS**, **PostgreSQL + Sequelize**, **Multer**, **express-session + bcrypt**, **PDFKit** (CV PDF).

## Fitur
- Halaman publik: Hero (tulisan PORTFOLIO di belakang foto), About, Statistik, Education, Experience, Organization, Certificates (carousel tak berujung + modal zoom), Skills, Projects (grid asimetris + halaman detail), Contact, Footer.
- Navbar pill sticky, hamburger di mobile, toggle **ID/EN**, mode **gelap/terang**.
- Dashboard admin (`/admin`) dengan login: CRUD profil, pendidikan, pengalaman, organisasi, skills, proyek, sertifikat.
- Upload foto profil, thumbnail proyek, dan gambar sertifikat (JPG/PNG/WEBP, maks 5 MB) → disimpan di `public/uploads/` dan path-nya di database.
- Statistik dihitung langsung dari database (tidak ada angka dummy).
- CV format Harvard: pratinjau di `/cv`, unduh PDF di `/cv/download`.

## Prasyarat
- Node.js 18+
- PostgreSQL 13+

## Instalasi
```bash
# 1. Install dependensi
npm install

# 2. Buat database (contoh via psql)
psql -U postgres -c "CREATE DATABASE portfolio_cv;"

# 3. Salin konfigurasi lalu sesuaikan isinya
cp .env.example .env          # Windows PowerShell: Copy-Item .env.example .env

# 4. Buat tabel + akun admin + profil kosong
npm run seed

# 5. Jalankan
npm run dev                   # atau: npm start
```
Buka http://localhost:3000 (website) dan http://localhost:3000/admin (dashboard).
Login memakai `ADMIN_USERNAME` dan `ADMIN_PASSWORD` dari `.env`, lalu segera ganti lewat menu **Ganti password**.

> Tabel dibuat otomatis oleh `sequelize.sync()` saat server/seed berjalan.

## Mengisi konten (urutan yang disarankan)
1. **Profil** — nama, foto, status pendidikan, IPK, ringkasan, kontak, tautan GitHub/LinkedIn. Isi juga *Mulai belajar IT (tahun)* agar statistik "Years of Learning" terhitung.
2. **Pendidikan, Pengalaman, Organisasi, Skills, Proyek, Sertifikat**.
3. Cek `/cv` lalu unduh PDF.

### Tips foto profil
Desain hero memakai foto *cutout* (latar transparan). Unggah **PNG/WEBP transparan** (mis. hasil remove background). Foto berlatar biasa tetap tampil, tetapi tidak menyatu dengan tulisan PORTFOLIO.

## Struktur folder
```
portfolio-cv/
├── server.js                 # entry point Express
├── config/                   # database.js, constants.js, resources.js (konfigurasi form CRUD)
├── models/                   # User, Profile, Education, Experience, Organization, Skill, Project, Certificate
├── middleware/               # auth.js (session), upload.js (Multer)
├── controllers/              # public, auth, admin (CRUD generik), cv (HTML + PDF)
├── routes/                   # public.js, admin.js
├── views/                    # EJS (index, project, cv, partials, admin/)
├── public/
│   ├── css/                  # style.css, cv.css, admin.css
│   ├── js/                   # main.js, carousel.js, admin.js
│   └── uploads/              # photos/, projects/, certificates/
├── scripts/seed.js
└── .env.example
```

## Skema database
- `Users` 1—1 `Profiles`
- `Profiles` 1—N `educations`, `experiences`, `organizations`, `skills`, `projects`, `certificates` (FK `ProfileId`, `ON DELETE CASCADE`)

## Keamanan yang sudah diterapkan
- Password di-hash dengan bcrypt; session di-regenerasi saat login; cookie `httpOnly` + `sameSite=lax`.
- Semua output EJS di-escape; URL form divalidasi harus `http(s)://`.
- Upload dibatasi tipe (JPG/PNG/WEBP) dan ukuran, nama file diacak, file lama dihapus saat diganti/dihapus.

## Sebelum deploy ke produksi
- Isi `SESSION_SECRET` dengan string acak panjang dan set `NODE_ENV=production`.
- Jalankan di belakang HTTPS (cookie `secure: 'auto'` aktif otomatis lewat proxy tepercaya).
- Session saat ini memakai penyimpanan memori bawaan (login hilang saat server restart). Untuk produksi ganti dengan `connect-pg-simple` atau sejenisnya.
- Pertimbangkan menambah token CSRF dan pembatasan percobaan login (`express-rate-limit`).
- Untuk perubahan skema di masa depan gunakan migrasi Sequelize, bukan `sync()`.

## Catatan font
Font Manrope dan Fraunces dimuat dari Google Fonts. Tanpa internet, tampilan memakai font sistem sebagai cadangan.
