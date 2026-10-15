import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Camera, ArrowRight, Check, Zap, BarChart3, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    { icon: Zap, title: 'Instant AI Analysis', desc: 'Get results in seconds using our advanced deep learning model trained on dermatological image datasets.' },
    { icon: Shield, title: 'Privacy First', desc: 'Your images are processed securely and never shared or sold. Your health data stays in your control.' },
    { icon: BarChart3, title: 'Ranked Predictions', desc: 'Receive multiple ranked predictions with confidence percentages to give comprehensive context.' },
    { icon: Clock, title: 'Analysis History', desc: 'Keep track of previous scans and assessments over time from your personal dashboard.' },
  ];

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section className="hero-section-dynamic" style={{
        position: 'relative',
        overflow: 'hidden',
        background: `
          radial-gradient(circle at 92% 12%, rgba(167, 243, 208, 0.45) 0%, rgba(204, 251, 241, 0.25) 35%, transparent 65%),
          radial-gradient(circle at 4% 82%, rgba(186, 230, 253, 0.4) 0%, rgba(204, 251, 241, 0.2) 35%, transparent 65%),
          #ffffff
        `,
        padding: '4.5rem 0 3.5rem',
        transition: 'background 0.3s ease'
      }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: '3.5rem'
          }}>
            {/* Left Column: Text & CTA */}
            <div>
              {/* Pill Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(204, 251, 241, 0.8)',
                color: '#0f766e',
                borderRadius: '9999px',
                padding: '0.4rem 1rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '1.75rem',
                border: '1px solid rgba(153, 246, 228, 0.6)'
              }}>
                <Shield size={14} style={{ color: '#0d9488' }} />
                AI-Powered Skin Analysis
              </div>

              {/* Headline */}
              <h1 className="hero-title-dynamic" style={{
                fontFamily: "'Outfit', var(--font-sans)",
                fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)',
                fontWeight: 800,
                color: '#1e293b',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '1.5rem',
                transition: 'color 0.3s ease'
              }}>
                Understand Your<br />
                Skin.<br />
                Care for it with<br />
                AI.
              </h1>

              {/* Subtitle */}
              <p style={{
                fontSize: '1.125rem',
                lineHeight: 1.65,
                color: 'var(--color-slate-500)',
                maxWidth: '490px',
                marginBottom: '2.25rem'
              }}>
                Upload a skin image or use your camera to receive AI-based informational insights about your skin.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  to={isAuthenticated ? "/analyzer" : "/analyzer"}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: '#00a896',
                    color: '#ffffff',
                    borderRadius: '9999px',
                    padding: '0.85rem 1.75rem',
                    fontWeight: 600,
                    fontSize: '1rem',
                    boxShadow: '0 6px 18px rgba(0, 168, 150, 0.3)',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#008f80')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#00a896')}
                >
                  Start Free Scan <Camera size={18} />
                </Link>

                <Link
                  to="/how-it-works"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: 'transparent',
                    color: '#00a896',
                    border: '2px solid #00a896',
                    borderRadius: '9999px',
                    padding: '0.8rem 1.75rem',
                    fontWeight: 600,
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(204, 251, 241, 0.25)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  How it works <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Right Column: Skincare Card & Floating Badge */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '490px' }}>
                {/* Photo Frame Container */}
                <div className="hero-card-frame" style={{
                  background: '#ffffff',
                  borderRadius: '26px',
                  padding: '12px',
                  boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.1)',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  transition: 'background 0.3s ease, border-color 0.3s ease'
                }}>
                  <img
                    src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80"
                    alt="Skin care therapy and facial treatment"
                    style={{
                      width: '100%',
                      height: '430px',
                      objectFit: 'cover',
                      borderRadius: '20px',
                      display: 'block'
                    }}
                  />
                </div>

                {/* Floating Prediction Pill Card */}
                <div className="hero-pill-overlay" style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '-16px',
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '0.75rem 1.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  boxShadow: '0 14px 32px -4px rgba(0, 0, 0, 0.14)',
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  zIndex: 2,
                  transition: 'background 0.3s ease, border-color 0.3s ease'
                }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0
                  }}>
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', fontWeight: 500, lineHeight: 1.2 }}>Model Prediction</div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--color-slate-900)', fontWeight: 700, lineHeight: 1.3 }}>Processing...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar below Hero */}
          <div className="stats-border" style={{
            borderTop: '1px solid #e2e8f0',
            paddingTop: '2.5rem',
            marginTop: '3.75rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem'
          }}>
            <div>
              <div className="stats-title" style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Outfit', var(--font-sans)", letterSpacing: '-0.02em' }}>AI</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-slate-500)', fontWeight: 500, marginTop: '0.2rem' }}>Deep learning visual analysis</div>
            </div>
            <div>
              <div className="stats-title" style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Outfit', var(--font-sans)", letterSpacing: '-0.02em' }}>50+</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-slate-500)', fontWeight: 500, marginTop: '0.2rem' }}>Skin conditions covered</div>
            </div>
            <div>
              <div className="stats-title" style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Outfit', var(--font-sans)", letterSpacing: '-0.02em' }}>Fast</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-slate-500)', fontWeight: 500, marginTop: '0.2rem' }}>Instant scan results</div>
            </div>
            <div>
              <div className="stats-title" style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Outfit', var(--font-sans)", letterSpacing: '-0.02em' }}>100%</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-slate-500)', fontWeight: 500, marginTop: '0.2rem' }}>Encrypted & private</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" style={{ background: 'var(--color-slate-50)', padding: '5rem 0' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h2 className="display-md" style={{ marginBottom: '0.75rem', color: 'var(--color-slate-900)' }}>Why Choose NEXORA AI?</h2>
            <p className="text-lg text-muted" style={{ maxWidth: 560, margin: '0 auto' }}>
              Combining cutting-edge AI with a privacy-first approach to give you meaningful skin health insights.
            </p>
          </div>
          <div className="features-grid">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card">
                <div className="feature-icon"><Icon size={24} /></div>
                <p className="feature-title">{title}</p>
                <p className="feature-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Medical Disclaimer Banner */}
      <section style={{ background: 'var(--color-white)', borderTop: '1px solid var(--color-slate-200)', padding: '2.5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-slate-500)', maxWidth: '780px', margin: '0 auto', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--color-slate-900)' }}>Medical Disclaimer:</strong> NEXORA AI is an informational tool powered by artificial intelligence. It does not provide medical advice, diagnosis, or treatment. Always consult a board-certified dermatologist or qualified healthcare provider for any health concerns.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
