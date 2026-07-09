import React, { useState } from 'react';
import { api } from '../api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please enter both email and password.'); return; }

    setLoading(true);
    try {
      const res = await api.login(email, password);
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed.'); return; }

      localStorage.setItem('en_token', data.token);
      localStorage.setItem('en_user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch {
      setError('Cannot connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('admin@errornest.com');
    setPassword('password');
    setError('');
    setLoading(true);
    try {
      const res = await api.login('admin@errornest.com', 'password');
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Demo login failed.'); return; }
      localStorage.setItem('en_token', data.token);
      localStorage.setItem('en_user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch {
      setError('Cannot connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-glow glow-1" />
        <div className="login-glow glow-2" />
        <div className="login-glow glow-3" />
      </div>

      <div className="login-box">
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon" style={{ width: 56, height: 56 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="14" rx="5" ry="6" />
                <path d="M9 9a3 3 0 0 1 6 0" />
                <path d="M10 13.5l-1.5 1 1.5 1" />
                <path d="M14 13.5l1.5 1-1.5 1" />
                <line x1="11.5" y1="16" x2="12.5" y2="12.5" />
                <path d="M7 11l-3-2" /><path d="M7 13l-3.5 0" /><path d="M7 15l-3 2" />
                <path d="M17 11l3-2" /><path d="M17 13l3.5 0" /><path d="M17 15l3 2" />
                <path d="M10 8.5l-2-2.5" /><path d="M14 8.5l2-2.5" />
              </svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h1 className="login-title">ERROR NEST</h1>
              <p className="login-subtitle">Bug Tracking System</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input type="checkbox" style={{ cursor: 'pointer' }} />
              Remember me
            </label>
            <a href="#" style={{ fontSize: 13, color: 'var(--color-primary-light)', textDecoration: 'none' }}>
              Forgot password?
            </a>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="login-divider">
            <span>or</span>
          </div>

          <button type="button" onClick={handleDemoLogin} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
            Continue with Demo Account
          </button>
        </form>

        <div className="login-footer">
          Don't have an account? <a href="#" style={{ color: 'var(--color-primary-light)', textDecoration: 'none', fontWeight: 600 }}>Sign up</a>
        </div>
      </div>
    </div>
  );
}
