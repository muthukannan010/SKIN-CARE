import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, History, LayoutDashboard, Settings, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Dark mode state with persistent storage
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexora_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('nexora_theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('nexora_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleMobile = () => setMobileOpen((p) => !p);

  return (
    <nav className="navbar" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(10px)',
      height: '70px',
      transition: 'background 0.3s ease, border-color 0.3s ease'
    }}>
      <div className="navbar-inner" style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '0 1.5rem',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12C6 8.68629 8.68629 6 12 6H20C23.3137 6 26 8.68629 26 12C26 15.3137 23.3137 18 20 18H12" stroke="#00b4d8" strokeWidth="3" strokeLinecap="round" />
            <path d="M26 20C26 23.3137 23.3137 26 20 26H12C8.68629 26 6 23.3137 6 20C6 16.6863 8.68629 14 12 14H20" stroke="#00b4d8" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span style={{ fontWeight: 800, fontSize: '1.4rem', color: isDark ? '#2dd4bf' : '#006666', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center' }}>
            NEXORA&nbsp;<span style={{ color: '#00a896' }}>ai</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>About</NavLink>
          <NavLink to="/features" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Features</NavLink>
          <NavLink to="/faq" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>FAQ</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Contact</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Dashboard</NavLink>
              <NavLink to="/analyzer" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Analyzer</NavLink>
              <NavLink to="/history" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>History</NavLink>
            </>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              background: isDark ? '#1e293b' : '#f8fafc',
              cursor: 'pointer',
              color: isDark ? '#f59e0b' : '#334155',
              transition: 'all 0.2s ease',
              boxShadow: isDark ? '0 0 12px rgba(245, 158, 11, 0.2)' : 'none'
            }}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {!isAuthenticated ? (
            <>
              <Link to="/login" style={{
                color: isDark ? '#f1f5f9' : '#1e293b',
                fontWeight: 600,
                fontSize: '0.9375rem',
                textDecoration: 'none',
                padding: '0.4rem 0.6rem'
              }}>
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  background: '#00a896',
                  color: '#ffffff',
                  borderRadius: '9999px',
                  padding: '0.6rem 1.45rem',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  boxShadow: '0 4px 14px rgba(0, 168, 150, 0.25)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  transition: 'background 0.2s ease'
                }}
              >
                Get Started
              </Link>
            </>
          ) : (
            <div style={{ position: 'relative' }}>
              <button
                className="navbar-avatar"
                onClick={() => setUserMenuOpen((p) => !p)}
                aria-label="User menu"
              >
                {user?.profile_image
                  ? <img src={user.profile_image} alt={user.first_name} />
                  : `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`}
              </button>
              {userMenuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  background: isDark ? '#1e293b' : '#ffffff',
                  border: isDark ? '1px solid #334155' : '1px solid var(--color-slate-200)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  minWidth: '200px', padding: '0.5rem', zIndex: 100
                }}>
                  <div style={{ padding: '0.75rem 1rem', borderBottom: isDark ? '1px solid #334155' : '1px solid var(--color-slate-100)', marginBottom: '0.25rem' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: isDark ? '#f8fafc' : 'var(--color-slate-800)' }}>
                      {user?.first_name} {user?.last_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: isDark ? '#94a3b8' : 'var(--color-slate-500)' }}>{user?.email}</div>
                  </div>
                  {[
                    { to: '/dashboard', icon: <LayoutDashboard size={15} />, label: 'Dashboard' },
                    { to: '/history', icon: <History size={15} />, label: 'History' },
                    { to: '/profile', icon: <User size={15} />, label: 'Profile' },
                    { to: '/settings', icon: <Settings size={15} />, label: 'Settings' },
                  ].map(({ to, icon, label }) => (
                    <Link key={to} to={to} onClick={() => setUserMenuOpen(false)} style={{
                      display: 'flex', alignItems: 'center', gap: '0.6rem',
                      padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem', color: isDark ? '#cbd5e1' : 'var(--color-slate-700)',
                      transition: 'var(--transition-base)', textDecoration: 'none'
                    }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? '#334155' : 'var(--color-slate-100)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {icon} {label}
                    </Link>
                  ))}
                  <div style={{ borderTop: isDark ? '1px solid #334155' : '1px solid var(--color-slate-100)', marginTop: '0.25rem', paddingTop: '0.25rem' }}>
                    <button onClick={handleLogout} style={{
                      display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%',
                      padding: '0.55rem 0.75rem', borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem', color: 'var(--color-error)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      transition: 'var(--transition-base)'
                    }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-error-light)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile toggle */}
          <button className="mobile-menu-btn" onClick={toggleMobile} aria-label="Toggle menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`mobile-nav${mobileOpen ? ' open' : ''}`}>
        {[
          ['/', 'Home'],
          ['/about', 'About'],
          ['/features', 'Features'],
          ['/faq', 'FAQ'],
          ['/contact', 'Contact'],
        ].map(([to, label]) => (
          <NavLink key={to} to={to} end={to === '/'} onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            {label}
          </NavLink>
        ))}
        {isAuthenticated && (
          <>
            <NavLink to="/dashboard" onClick={() => setMobileOpen(false)} className="nav-link">Dashboard</NavLink>
            <NavLink to="/analyzer" onClick={() => setMobileOpen(false)} className="nav-link">Analyzer</NavLink>
            <NavLink to="/history" onClick={() => setMobileOpen(false)} className="nav-link">History</NavLink>
            <NavLink to="/profile" onClick={() => setMobileOpen(false)} className="nav-link">Profile</NavLink>
          </>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--color-slate-200)' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-slate-600)' }}>Appearance</span>
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.8rem',
              borderRadius: '999px',
              border: '1px solid var(--color-slate-300)',
              fontSize: '0.8125rem'
            }}
          >
            {isDark ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} />}
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
        {!isAuthenticated ? (
          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <Link to="/login" className="btn btn-outline btn-sm" onClick={() => setMobileOpen(false)}>Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMobileOpen(false)}>Get Started</Link>
          </div>
        ) : (
          <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ color: 'var(--color-error)' }}>
            <LogOut size={15} /> Sign Out
          </button>
        )}
      </div>

      {/* Close user menu on outside click */}
      {userMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setUserMenuOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;
