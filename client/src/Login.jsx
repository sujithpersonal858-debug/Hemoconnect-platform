import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (email === 'admin@hemoconnect.org') {
        navigate('/admin');
      } else if (email === 'donor@example.com') {
        navigate('/donor-dashboard');
      } else {
        navigate(redirectPath === '/login' ? '/' : redirectPath);
      }
    } else {
      setErrorMsg(res.message || 'Invalid credentials');
    }
  };

  // Quick fill demo credentials
  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="auth-page container">
      <div className="auth-card-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-brand-icon">
              <Heart className="text-red" fill="#dc2626" size={28} />
            </div>
            <h2 className="auth-title">Sign In to HemoConnect</h2>
            <p className="auth-sub">
              Access your donor profile, blood requisitions, or restricted admin console.
            </p>
          </div>

          {errorMsg && (
            <div className="alert-box alert-error">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-auth-submit">
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="demo-credentials-box">
            <span className="demo-box-title">
              <ShieldCheck size={14} /> Quick Demo Logins:
            </span>
            <div className="demo-buttons-grid">
              <button
                type="button"
                onClick={() => fillDemo('admin@hemoconnect.org', 'HemoAdmin2026!')}
                className="btn-demo-badge admin"
              >
                Admin Console
              </button>
              <button
                type="button"
                onClick={() => fillDemo('donor@example.com', 'password123')}
                className="btn-demo-badge donor"
              >
                Voluntary Donor
              </button>
              <button
                type="button"
                onClick={() => fillDemo('seeker@example.com', 'password123')}
                className="btn-demo-badge seeker"
              >
                Blood Seeker
              </button>
            </div>
          </div>

          <div className="auth-footer-link">
            <span>Don't have an account yet? </span>
            <Link to="/register" className="text-red font-bold">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
