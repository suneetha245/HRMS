const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Admin = require('../models/Admin');

router.post('/forgot-password', async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').toLowerCase().trim();
    if (!email) return res.status(400).json({ message: 'Enter your email address.' });
    const admin = await Admin.findOne({ email });
    // Use the same response whether or not the email belongs to an admin.
    if (admin) {
      if (!process.env.RESEND_API_KEY || !process.env.RESET_EMAIL_FROM || !process.env.CLIENT_URL) {
        return res.status(503).json({ message: 'Password reset email is not configured. Contact your system administrator.' });
      }
      const token = crypto.randomBytes(32).toString('hex');
      admin.passwordResetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
      admin.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
      await admin.save();
      const resetUrl = `${process.env.CLIENT_URL.replace(/\/$/, '')}/login?resetToken=${token}`;
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.RESET_EMAIL_FROM,
          to: [admin.email],
          subject: 'Reset your HRMS password',
          html: `<p>We received a request to reset your HRMS password.</p><p><a href="${resetUrl}">Reset your password</a></p><p>This link expires in one hour. If you did not request this, you can ignore this email.</p>`,
        }),
      });
      if (!response.ok) {
        admin.passwordResetTokenHash = undefined;
        admin.passwordResetExpires = undefined;
        await admin.save();
        console.error('Password reset email could not be sent:', await response.text());
        return res.status(502).json({ message: 'Unable to send the reset email right now. Please try again later.' });
      }
    }
    res.json({ message: 'If an admin account exists for that email, a password reset link has been sent.' });
  } catch (e) { next(e); }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, password } = req.body || {};
    if (!token || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ message: 'Use a valid reset link and a password with at least 8 characters.' });
    }
    const tokenHash = crypto.createHash('sha256').update(String(token)).digest('hex');
    const admin = await Admin.findOne({ passwordResetTokenHash: tokenHash, passwordResetExpires: { $gt: new Date() } });
    if (!admin) return res.status(400).json({ message: 'This password reset link is invalid or expired. Request a new one.' });
    admin.password = await bcrypt.hash(password, 10);
    admin.passwordResetTokenHash = undefined;
    admin.passwordResetExpires = undefined;
    await admin.save();
    res.json({ message: 'Password updated. You can now sign in with your new password.' });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const admin = await Admin.findOne({ email: String(email).toLowerCase().trim() });
    if (!admin) return res.status(401).json({ message: 'No account was found for that email address.' });
    const passwordMatches = await bcrypt.compare(password, admin.password);
    if (!passwordMatches) return res.status(401).json({ message: 'Incorrect password. Please try again.' });
    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, admin: { email: admin.email } });
  } catch (e) { next(e); }
});

module.exports = router;
