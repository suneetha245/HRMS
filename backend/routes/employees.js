const router = require('express').Router();
const mongoose = require('mongoose');
const ExcelJS = require('exceljs');
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');

router.use(auth);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s-]{10,15}$/;

function validate(b) {
  const name = (b.name || '').trim(), email = (b.email || '').trim().toLowerCase();
  const phone = (b.phone || '').trim(), designation = (b.designation || '').trim();
  if (!name || !email || !phone || !designation) return { error: 'All fields are required' };
  if (!EMAIL_RE.test(email)) return { error: 'Enter a valid email address' };
  if (!PHONE_RE.test(phone)) return { error: 'Enter a valid phone number (10-15 digits)' };
  return { data: { name, email, phone, designation } };
}

const validId = (req, res, next) =>
  mongoose.isValidObjectId(req.params.id) ? next() : res.status(400).json({ message: 'Invalid employee id' });

// Export (must be declared before /:id)
router.get('/export', async (req, res, next) => {
  try {
    const list = await Employee.find().sort({ createdAt: -1 });
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Employees');
    ws.columns = [
      { header: 'Name', key: 'name', width: 28 },
      { header: 'Email', key: 'email', width: 34 },
      { header: 'Phone Number', key: 'phone', width: 18 },
      { header: 'Designation', key: 'designation', width: 26 },
    ];
    list.forEach((e) => ws.addRow(e.toObject()));
    const head = ws.getRow(1);
    head.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    head.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
    ws.getColumn('phone').numFmt = '@';
    ws.views = [{ state: 'frozen', ySplit: 1 }];
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="Employee_List.xlsx"');
    await wb.xlsx.write(res);
    res.end();
  } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try { res.json(await Employee.find().sort({ createdAt: -1 })); } catch (e) { next(e); }
});

router.get('/:id', validId, async (req, res, next) => {
  try {
    const emp = await Employee.findById(req.params.id);
    emp ? res.json(emp) : res.status(404).json({ message: 'Employee not found' });
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { data, error } = validate(req.body);
    if (error) return res.status(400).json({ message: error });
    if (await Employee.findOne({ email: data.email }))
      return res.status(409).json({ message: 'An employee with this email already exists' });
    const emp = await Employee.create(data);
    res.status(201).json(emp);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'Duplicate employee email' });
    next(e);
  }
});

router.put('/:id', validId, async (req, res, next) => {
  try {
    const { data, error } = validate(req.body);
    if (error) return res.status(400).json({ message: error });
    if (await Employee.findOne({ email: data.email, _id: { $ne: req.params.id } }))
      return res.status(409).json({ message: 'An employee with this email already exists' });
    const emp = await Employee.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    emp ? res.json(emp) : res.status(404).json({ message: 'Employee not found' });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'Duplicate employee email' });
    next(e);
  }
});

router.delete('/:id', validId, async (req, res, next) => {
  try {
    const emp = await Employee.findByIdAndDelete(req.params.id);
    emp ? res.json({ message: 'Employee deleted' }) : res.status(404).json({ message: 'Employee not found' });
  } catch (e) { next(e); }
});

module.exports = router;
