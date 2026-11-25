import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../api';

export default function Login() {
  const { isAuth, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuth) return <Navigate to="/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) return setError('Email and password are required');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-layout">
        <aside className="login-visual" aria-label="HR team meeting">
          <img src="/images/hr-login-meeting.png" alt="Colleagues collaborating around a table in a meeting" />
          <div className="visual-copy">
            <span className="visual-eyebrow">PEOPLE FIRST</span>
            <h1>Great teams<br />start here.</h1>
            <p>One place to support your people and keep your workplace moving.</p>
          </div>
        </aside>
        <section className="login-form-panel" aria-label="Admin sign in">
          <form className="login-card" onSubmit={submit} noValidate>
            <div className="brand dark">HR<span>MS</span></div>
            <h2>Admin Login</h2>
            <p className="hint">Authorized HR/Admin users only</p>
            {error && <div className="alert">{error}</div>}
            <div className="field">
              <label>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@hrms.com" autoFocus />
            </div>
            <div className="field">
              <label>Password</label>
              <div className="password-input-wrap">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.7a2 2 0 002.7 2.7M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.3 9.5 6-.4.8-1.4 2.2-3.3 3.6M6.2 6.2C3.8 7.7 2.6 10 2.5 11c1 1.7 4.5 6 9.5 6 1 0 2-.2 2.9-.5" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" /><circle cx="12" cy="12" r="2.5" /></svg>
                  )}
                </button>
              </div>
            </div>
            <button className="btn primary block" disabled={loading}>{loading ? 'Signing in…' : 'Login'}</button>
            <Link to="/" className="back">← Back to home</Link>
          </form>
        </section>
      </div>
    </div>
  );
}
