import React from 'react';
import { Link } from 'react-router-dom';
import { Scan, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', textDecoration: 'none' }}>
              <Scan size={20} />
              NEXORA AI
            </Link>
            <p className="footer-brand-desc">
              AI-powered skin health analysis. Informational insights to guide better healthcare decisions. Not a substitute for professional medical advice.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="footer-heading">Product</p>
            <ul className="footer-links">
              {[['/', 'Home'], ['/features', 'Features'], ['/how-it-works', 'How It Works'], ['/about', 'About']].map(([to, label]) => (
                <li key={to}><Link to={to} className="footer-link">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="footer-heading">Account</p>
            <ul className="footer-links">
              {[['/login', 'Sign In'], ['/register', 'Sign Up'], ['/dashboard', 'Dashboard'], ['/analyzer', 'Analyzer']].map(([to, label]) => (
                <li key={to}><Link to={to} className="footer-link">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="footer-heading">Legal</p>
            <ul className="footer-links">
              {[['/privacy', 'Privacy Policy'], ['/terms', 'Terms of Service'], ['/faq', 'FAQ'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}><Link to={to} className="footer-link">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} NEXORA AI. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built with <Heart size={13} style={{ color: '#f87171' }} /> for better skin health
          </p>
          <p style={{ color: 'var(--color-slate-500)', fontSize: '0.8rem' }}>
            Not a medical device. For informational use only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
