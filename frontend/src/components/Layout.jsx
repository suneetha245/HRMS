import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const doLogout = () => { logout(); navigate('/login', { replace: true }); };
  const link = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">HR<span>MS</span></div>
        <nav onClick={() => setOpen(false)}>
          <NavLink to="/dashboard" className={link}>Dashboard</NavLink>
          <NavLink to="/employees" className={link}>Employee Management</NavLink>
        </nav>
        <button className="nav-link logout" onClick={doLogout}>Logout</button>
      </aside>
      {open && <div className="backdrop" onClick={() => setOpen(false)} />}
      <div className="main">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setOpen(true)} aria-label="Open menu">☰</button>
          <strong>HR Management System</strong>
        </header>
        <main className="content"><Outlet /></main>
      </div>
    </div>
  );
}
