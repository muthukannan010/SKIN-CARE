import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Scan } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ApiError, FormErrors, RegisterPayload } from '../types';
import ErrorMessage from '../components/common/ErrorMessage';

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterPayload>({
    first_name: '', last_name: '', username: '', email: '',
    password: '', confirm_password: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.first_name.trim()) e.first_name = 'First name is required.';
    if (!form.last_name.trim()) e.last_name = 'Last name is required.';
    if (!form.username.trim()) e.username = 'Username is required.';
    else if (!/^[a-zA-Z0-9_]{3,30}$/.test(form.username))
      e.username = 'Username must be 3–30 alphanumeric characters or underscores.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (!form.confirm_password) e.confirm_password = 'Please confirm your password.';
    else if (form.password !== form.confirm_password) e.confirm_password = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setApiError('');
    setIsLoading(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const ae = err as ApiError;
      setApiError(ae.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const set = (field: keyof RegisterPayload, value: string) => {
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
          Start your skin health journey today.
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
          Create a free account to access AI-powered skin analysis, track your history, and get personalized insights.
        </p>
        <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-lg)', backdropFilter: 'blur(8px)' }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>IMPORTANT NOTICE</p>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            NEXORA AI provides informational results only. It is not a medical device and cannot diagnose conditions. Always consult a qualified healthcare professional.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-panel-right">
        <div style={{ maxWidth: 480, width: '100%', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-slate-900)', marginBottom: '0.4rem' }}>
              Create Account
            </h1>
            <p style={{ color: 'var(--color-slate-500)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--color-teal-600)', fontWeight: 600 }}>Sign in</Link>
            </p>
          </div>

          {apiError && <ErrorMessage message={apiError} className="mb-4" />}

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div className="grid-2">
              <div className="form-group">
                <label htmlFor="first_name" className="form-label">First Name</label>
                <div className="input-wrapper">
                  <User size={15} className="input-icon" />
                  <input id="first_name" type="text" className={`form-input${errors.first_name ? ' error' : ''}`}
                    placeholder="First name" value={form.first_name} onChange={(e) => set('first_name', e.target.value)} autoFocus />
                </div>
                {errors.first_name && <span className="form-error">{errors.first_name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="last_name" className="form-label">Last Name</label>
                <div className="input-wrapper">
                  <User size={15} className="input-icon" />
                  <input id="last_name" type="text" className={`form-input${errors.last_name ? ' error' : ''}`}
                    placeholder="Last name" value={form.last_name} onChange={(e) => set('last_name', e.target.value)} />
                </div>
                {errors.last_name && <span className="form-error">{errors.last_name}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <div className="input-wrapper">
                <span className="input-icon" style={{ fontSize: '0.9rem', color: 'var(--color-slate-400)' }}>@</span>
                <input id="username" type="text" className={`form-input${errors.username ? ' error' : ''}`}
                  placeholder="Choose a username" value={form.username} onChange={(e) => set('username', e.target.value)}
                  autoComplete="username" />
              </div>
              {errors.username && <span className="form-error">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-wrapper">
                <Mail size={15} className="input-icon" />
                <input id="email" type="email" className={`form-input${errors.email ? ' error' : ''}`}
                  placeholder="you@example.com" value={form.email} onChange={(e) => set('email', e.target.value)}
                  autoComplete="email" />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock size={15} className="input-icon" />
                <input id="password" type={showPw ? 'text' : 'password'}
                  className={`form-input${errors.password ? ' error' : ''}`}
                  placeholder="At least 8 characters" value={form.password}
                  onChange={(e) => set('password', e.target.value)} autoComplete="new-password" />
                <button type="button" className="input-icon-right" onClick={() => setShowPw((p) => !p)} aria-label="Toggle password">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <Lock size={15} className="input-icon" />
                <input id="confirm_password" type={showCpw ? 'text' : 'password'}
                  className={`form-input${errors.confirm_password ? ' error' : ''}`}
                  placeholder="Repeat your password" value={form.confirm_password}
                  onChange={(e) => set('confirm_password', e.target.value)} autoComplete="new-password" />
                <button type="button" className="input-icon-right" onClick={() => setShowCpw((p) => !p)} aria-label="Toggle confirm password">
                  {showCpw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.confirm_password && <span className="form-error">{errors.confirm_password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={isLoading} style={{ marginTop: '0.5rem' }}>
              {isLoading ? (
                <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Creating Account…</>
              ) : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8125rem', color: 'var(--color-slate-400)' }}>
            By registering, you agree to our{' '}
            <Link to="/terms" style={{ color: 'var(--color-teal-600)' }}>Terms</Link> and{' '}
            <Link to="/privacy" style={{ color: 'var(--color-teal-600)' }}>Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
