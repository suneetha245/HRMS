import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useToast } from '../context/ToastContext';

export default function Dashboard() {
  const [emps, setEmps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    api.get('/employees').then((r) => setEmps(r.data)).catch((e) => toast(errMsg(e), 'error')).finally(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  // The data model has no status field, so every stored employee counts as active.
  const stats = [
    { label: 'Total Employees', value: emps.length },
    { label: 'Active Employees', value: emps.length },
    { label: 'Recently Added', value: emps.slice(0, 5).length },
  ];

  return (
    <>
      <div className="page-head">
        <h2>Dashboard</h2>
        <button className="btn primary" onClick={() => navigate('/employees', { state: { add: true } })}>+ Add Employee</button>
      </div>
      <div className="stats">
        {stats.map((s) => (
          <div className="card stat" key={s.label}><span>{s.label}</span><strong>{loading ? '…' : s.value}</strong></div>
        ))}
      </div>
      <div className="card">
        <h3>Recent Employees</h3>
        {!loading && emps.length === 0 ? (
          <p className="empty">No employees yet. Add your first employee.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Designation</th></tr></thead>
              <tbody>
                {emps.slice(0, 5).map((e) => (
                  <tr key={e._id}><td>{e.name}</td><td>{e.email}</td><td>{e.designation}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
