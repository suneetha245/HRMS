const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const admin = await Admin.findOne({ email: String(email).toLowerCase().trim() });
    const ok = admin && (await bcrypt.compare(password, admin.password));
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });
    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, admin: { email: admin.email } });
  } catch (e) { next(e); }
});

module.exports = router;
