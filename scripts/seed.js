require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User, Profile } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD;
    if (!password || password.length < 8) {
      throw new Error('Isi ADMIN_PASSWORD (minimal 8 karakter) di file .env terlebih dahulu.');
    }

    let user = await User.findOne({ where: { username } });
    if (user) {
      console.log(`Admin "${username}" sudah ada. Tidak ada perubahan.`);
    } else {
      user = await User.create({ username, passwordHash: await bcrypt.hash(password, 12) });
      console.log(`Admin "${username}" berhasil dibuat.`);
    }

    // Profil kosong (diisi lewat dashboard admin) — tanpa data dummy
    const profile = await Profile.findOne();
    if (!profile) await Profile.create({ UserId: user.id });
    else if (!profile.UserId) await profile.update({ UserId: user.id });

    console.log('Seed selesai. Login di /admin/login lalu lengkapi profil Anda.');
    process.exit(0);
  } catch (err) {
    console.error('Seed gagal:', err.message);
    process.exit(1);
  }
})();
