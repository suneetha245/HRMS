import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { errMsg } from '../api';

export default function Login() {
  const { isAuth, login } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const resetToken = searchParams.get('resetToken');
  const forgotMode = searchParams.get('forgot') === '1';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');

  if (isAuth) return <Navigate to="/dashboard" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) return setError('Enter your email address to sign in.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      return setError('Enter a valid email address, for example admin@hrms.com.');
    }
    if (!password) return setError('Enter your password to sign in.');
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

  const requestReset = async (e) => {
    e.preventDefault();
    setError(''); setNotice('');
    if (!email.trim()) return setError('Enter your email address to receive a reset link.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setError('Enter a valid email address.');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email: email.trim() });
      setNotice(data.message);
    } catch (err) { setError(errMsg(err)); }
    finally { setLoading(false); }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setError(''); setNotice('');
    if (password.length < 8) return setError('Choose a password with at least 8 characters.');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', { token: resetToken, password });
      setNotice(data.message);
      setPassword('');
      setSearchParams({}, { replace: true });
    } catch (err) { setError(errMsg(err)); }
    finally { setLoading(false); }
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
          <form className="login-card" onSubmit={resetToken ? updatePassword : forgotMode ? requestReset : submit} noValidate>
            <div className="brand dark">HR<span>MS</span></div>
            <h2>{resetToken ? 'Reset Password' : 'Admin Login'}</h2>
            <p className="hint">{resetToken ? 'Choose a new password for your account.' : 'Authorized HR/Admin users only'}</p>
            {error && <div className="alert">{error}</div>}
            {notice && <div className="alert success-alert" role="status">{notice}</div>}
            {resetToken ? (
              <>
                <div className="field"><label htmlFor="new-password">New Password</label><input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" /></div>
                <button className="btn primary block" disabled={loading}>{loading ? 'Updating…' : 'Update Password'}</button>
              </>
            ) : (
              <>
            <div className="field">
              <label htmlFor="login-email">Email Address</label>
              <input id="login-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} placeholder="admin@hrms.com" autoFocus autoComplete="username" />
            </div>
            {forgotMode ? (
              <>
                <button type="submit" className="btn primary block" disabled={loading}>{loading ? 'Sending…' : 'Send Reset Link'}</button>
                <button type="button" className="back link-button" onClick={() => { setError(''); setNotice(''); setSearchParams({}); }}>← Back to login</button>
              </>
            ) : <>
            <div className="field">
              <label htmlFor="login-password">Password</label>
              <div className="password-input-wrap">
                <input id="login-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder="••••••••" autoComplete="current-password" />
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
            <button type="submit" className="btn primary block" disabled={loading}>{loading ? 'Signing in…' : 'Login'}</button>
            <button type="button" className="back link-button" onClick={() => window.alert('HR password is handled by the Administration team. Please contact your administrator.')}>Forgot password?</button>
            </>}
              </>
            )}
            <Link to="/" className="back">← Back to home</Link>
          </form>
        </section>
      </div>
    </div>
  );
}
