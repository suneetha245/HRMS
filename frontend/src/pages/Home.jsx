import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home">
      <nav className="home-nav">
        <div className="brand dark">HR<span>MS</span></div>
        <Link to="/login" className="btn primary">Admin Login</Link>
      </nav>
      <section className="hero">
        <h1>HR Management System</h1>
        <p>A simple, secure way for HR teams to manage employee records — add, update, search and export your workforce data in one place.</p>
        <Link to="/login" className="btn primary lg">Get Started</Link>
        <div className="features">
          <div className="card"><h4>Employee Records</h4><p>Create, edit and remove employees with validation.</p></div>
          <div className="card"><h4>Quick Search</h4><p>Find anyone instantly by name or email.</p></div>
          <div className="card"><h4>Excel Export</h4><p>Download the latest employee list as .xlsx.</p></div>
        </div>
      </section>
      <footer className="home-footer">
        <div className="home-contact" id="contact">
          <h2>Contact</h2>
          <p>For help with HRMS, please contact your HR administrator.</p>
        </div>
        <p className="home-copyright">© {new Date().getFullYear()} HR Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}
