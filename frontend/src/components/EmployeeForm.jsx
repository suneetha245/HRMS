import { useState } from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s-]{10,15}$/;

export default function EmployeeForm({ initial, onSubmit, onClose, saving }) {
  const [f, setF] = useState({ name: '', email: '', phone: '', designation: '', ...initial });
  const [errs, setErrs] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    ['name', 'email', 'phone', 'designation'].forEach((k) => { if (!String(f[k]).trim()) er[k] = 'Required'; });
    if (!er.email && !EMAIL_RE.test(f.email.trim())) er.email = 'Enter a valid email';
    if (!er.phone && !PHONE_RE.test(f.phone.trim())) er.phone = 'Enter a valid phone (10-15 digits)';
    setErrs(er);
    if (!Object.keys(er).length) onSubmit(f);
  };

  const field = (k, label, type = 'text', ph = '') => (
    <div className="field">
      <label>{label}</label>
      <input type={type} value={f[k]} onChange={set(k)} placeholder={ph} className={errs[k] ? 'invalid' : ''} />
      {errs[k] && <small className="err">{errs[k]}</small>}
    </div>
  );

  return (
    <div className="modal-wrap" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit} noValidate>
        <h3>{initial?._id ? 'Edit Employee' : 'Add Employee'}</h3>
        {field('name', 'Full Name', 'text', 'Jane Doe')}
        {field('email', 'Email Address', 'email', 'jane@company.com')}
        {field('phone', 'Phone Number', 'tel', '9876543210')}
        {field('designation', 'Designation', 'text', 'Software Engineer')}
        <div className="actions">
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={saving}>{saving ? 'Saving…' : initial?._id ? 'Update' : 'Add Employee'}</button>
        </div>
      </form>
    </div>
  );
}
