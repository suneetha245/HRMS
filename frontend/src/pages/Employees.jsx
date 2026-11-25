import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useToast } from '../context/ToastContext';
import EmployeeForm from '../components/EmployeeForm';

export default function Employees() {
  const location = useLocation();
  const toast = useToast();
  const [emps, setEmps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(location.state?.add ? {} : null); // null=closed, {}=add, object=edit
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = async () => {
    try { setEmps((await api.get('/employees')).data); }
    catch (e) { toast(errMsg(e), 'error'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? emps.filter((e) => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q)) : emps;
  }, [emps, search]);

  const save = async (data) => {
    setSaving(true);
    try {
      const body = { name: data.name, email: data.email, phone: data.phone, designation: data.designation };
      if (form._id) { await api.put(`/employees/${form._id}`, body); toast('Employee updated successfully'); }
      else { await api.post('/employees', body); toast('Employee added successfully'); }
      setForm(null);
      await load();
    } catch (e) { toast(errMsg(e), 'error'); }
    finally { setSaving(false); }
  };

  const remove = async () => {
    try {
      await api.delete(`/employees/${toDelete._id}`);
      toast('Employee deleted');
      setToDelete(null);
      await load();
    } catch (e) { toast(errMsg(e), 'error'); }
  };

  const exportExcel = async () => {
    try {
      const res = await api.get('/employees/export', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url; a.download = 'Employee_List.xlsx';
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      toast('Employee_List.xlsx downloaded');
    } catch { toast('Export failed. Please try again.', 'error'); }
  };

  return (
    <>
      <div className="page-head">
        <h2>Employee Management</h2>
        <button className="btn primary" onClick={() => setForm({})}>+ Add Employee</button>
      </div>
      <div className="card">
        <div className="toolbar">
          <input className="search" placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn success" onClick={exportExcel} disabled={!emps.length}>⬇ Export to Excel</button>
        </div>
        {loading ? <p className="empty">Loading…</p> : filtered.length === 0 ? (
          <p className="empty">{emps.length ? 'No employees match your search.' : 'No employees available. Click "Add Employee" to create one.'}</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Designation</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e._id}>
                    <td>{e.name}</td><td>{e.email}</td><td>{e.phone}</td><td>{e.designation}</td>
                    <td className="row-actions">
                      <button className="btn sm ghost" onClick={() => setForm(e)}>Edit</button>
                      <button className="btn sm danger" onClick={() => setToDelete(e)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {form && <EmployeeForm initial={form} saving={saving} onSubmit={save} onClose={() => setForm(null)} />}
      {toDelete && (
        <div className="modal-wrap" onMouseDown={(e) => e.target === e.currentTarget && setToDelete(null)}>
          <div className="modal">
            <h3>Delete Employee</h3>
            <p>Are you sure you want to delete <strong>{toDelete.name}</strong>? This cannot be undone.</p>
            <div className="actions">
              <button className="btn ghost" onClick={() => setToDelete(null)}>Cancel</button>
              <button className="btn danger" onClick={remove}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
