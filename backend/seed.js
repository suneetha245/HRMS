// Creates (or updates) the HR/Admin account using ADMIN_EMAIL / ADMIN_PASSWORD from .env
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

(async () => {
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase(), pw = process.env.ADMIN_PASSWORD;
  if (!email || !pw) { console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env'); process.exit(1); }
  await mongoose.connect(process.env.MONGO_URI);
  await Admin.findOneAndUpdate({ email }, { email, password: await bcrypt.hash(pw, 10) }, { upsert: true });
  console.log(`Admin ready: ${email}`);
  await mongoose.disconnect();
})();
