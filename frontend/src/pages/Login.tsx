import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Scan } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ApiError, FormErrors } from '../types';
import ErrorMessage from '../components/common/ErrorMessage';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const next = params.get('next') || '/dashboard';

  const [form, setForm] = useState({ email_or_username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.email_or_username.trim()) e.email_or_username = 'Email or username is required.';
    if (!form.password) e.password = 'Password is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setApiError('');
    setIsLoading(true);
    try {
      await login(form.email_or_username, form.password);
      navigate(next, { replace: true });
    } catch (err) {
      const ae = err as ApiError;
      setApiError(ae.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const set = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: '' }));
  };

  return (
    <div className="auth-layout">
      {/* Left Panel */}
      <div className="auth-panel-left">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', textDecoration: 'none', marginBottom: '3rem' }}>
          <Scan size={24} /> NEXORA AI
        </Link>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
          Welcome back to your skin health dashboard.
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, fontSize: '1rem' }}>
          Access your analysis history, track changes, and get new AI-powered skin health insights instantly.
        </p>
        <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {['Secure & private analysis', 'Full history access', 'Condition explanations & care tips'].map((t) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.9)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-teal-300)' }} />
              <span style={{ fontSize: '0.9375rem' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-panel-right">
        <div style={{ maxWidth: 420, width: '100%', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-slate-900)', marginBottom: '0.4rem' }}>
              Sign In
            </h1>
            <p style={{ color: 'var(--color-slate-500)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--color-teal-600)', fontWeight: 600 }}>Create one</Link>
            </p>
          </div>

          {apiError && <ErrorMessage message={apiError} className="mb-4" />}

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label htmlFor="email_or_username" className="form-label">Email or Username</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  id="email_or_username"
                  type="text"
                  className={`form-input${errors.email_or_username ? ' error' : ''}`}
                  placeholder="Enter your email or username"
                  value={form.email_or_username}
                  onChange={(e) => set('email_or_username', e.target.value)}
                  autoComplete="username"
                  autoFocus
                />
              </div>
              {errors.email_or_username && <span className="form-error">{errors.email_or_username}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  className={`form-input${errors.password ? ' error' : ''}`}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPw((p) => !p)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={isLoading}>
              {isLoading ? (
                <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Signing in…</>
              ) : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8125rem', color: 'var(--color-slate-400)' }}>
            By signing in, you agree to our{' '}
            <Link to="/terms" style={{ color: 'var(--color-teal-600)' }}>Terms</Link> and{' '}
            <Link to="/privacy" style={{ color: 'var(--color-teal-600)' }}>Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
