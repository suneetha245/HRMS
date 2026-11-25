import { useState } from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s-]{10,15}$/;

export default function EmployeeForm({ initial, onSubmit, onClose, saving }) {
  const [f, setF] = useState({ name: '', email: '', phone: '', designation: '', ...initial });
  const [errs, setErrs] = useState({});
  const set = (k) => (e) => {
    setF({ ...f, [k]: e.target.value });
    if (errs[k]) setErrs((prev) => ({ ...prev, [k]: '' }));
  };

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!f.name.trim()) er.name = 'Enter the employee’s full name.';
    if (!f.email.trim()) er.email = 'Enter the employee’s email address.';
    else if (!EMAIL_RE.test(f.email.trim())) er.email = 'Enter a valid email address, such as name@company.com.';
    if (!f.phone.trim()) er.phone = 'Enter the employee’s phone number.';
    else if (!PHONE_RE.test(f.phone.trim())) er.phone = 'Use 10–15 characters: digits, spaces, or hyphens, with an optional + at the start.';
    if (!f.designation.trim()) er.designation = 'Enter the employee’s job title or designation.';
    setErrs(er);
    if (!Object.keys(er).length) onSubmit(f);
  };

  const field = (k, label, type = 'text', ph = '') => (
    <div className="field">
      <label htmlFor={`employee-${k}`}>{label}</label>
      <input id={`employee-${k}`} type={type} value={f[k]} onChange={set(k)} placeholder={ph} className={errs[k] ? 'invalid' : ''} aria-invalid={!!errs[k]} aria-describedby={errs[k] ? `employee-${k}-error` : undefined} />
      {errs[k] && <small className="err" id={`employee-${k}-error`}>{errs[k]}</small>}
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
