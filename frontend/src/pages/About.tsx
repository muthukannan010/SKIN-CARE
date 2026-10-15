import React from 'react';
import { Scan, Target, Eye, Award, Users } from 'lucide-react';

const About: React.FC = () => (
  <div className="page-wrapper">
    <div className="page-header" style={{ background: 'linear-gradient(135deg, var(--color-teal-700), var(--color-teal-500))', color: 'white', borderBottom: 'none' }}>
      <div className="container">
        <h1 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Scan size={28} /> About NEXORA AI
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem' }}>
          Our mission, technology, and commitment to responsible AI in healthcare
        </p>
      </div>
    </div>

    <div className="main-content" style={{ paddingTop: 0 }}>
      <div className="container" style={{ paddingBottom: '4rem', paddingTop: '3rem' }}>
        {/* Mission */}
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--color-teal-500)' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div className="feature-icon" style={{ margin: 0 }}><Target size={22} /></div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', marginBottom: '0.75rem' }}>Our Mission</h2>
              <p style={{ color: 'var(--color-slate-600)', lineHeight: 1.8, fontSize: '1rem' }}>
                NEXORA AI was built to make basic skin health information more accessible. We believe that understanding common skin conditions — their symptoms, causes, and when to seek care — should not require a specialist appointment for every inquiry. Our AI model provides informational insights to help users make more informed decisions about seeking professional care.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="card">
            <div className="feature-icon"><Eye size={22} /></div>
            <h3 className="feature-title">What We Do</h3>
            <p className="feature-desc">
              NEXORA AI uses deep learning computer vision models to analyze uploaded skin images and provide ranked informational predictions. We surface condition descriptions, symptoms, supportive care advice, and guidance on when to see a doctor.
            </p>
          </div>
          <div className="card">
            <div className="feature-icon"><Award size={22} /></div>
            <h3 className="feature-title">Responsible AI</h3>
            <p className="feature-desc">
              We are committed to responsible AI. Every analysis result is clearly labeled as informational and not a medical diagnosis. We always remind users to consult a qualified healthcare professional before making any health decisions.
            </p>
          </div>
        </div>

        {/* Disclaimer Box */}
        <div className="info-box info-box-teal" style={{ marginBottom: '2rem' }}>
          <Scan size={18} style={{ flexShrink: 0 }} />
          <div>
            <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Important Notice</p>
            <p>NEXORA AI is an informational tool only. It is not a medical device, does not provide medical diagnoses, and is not a replacement for professional healthcare. Always consult a licensed healthcare provider for any medical concern.</p>
          </div>
        </div>

        <div className="card">
          <div className="feature-icon"><Users size={22} /></div>
          <h3 className="feature-title">Built For You</h3>
          <p className="feature-desc" style={{ marginBottom: '1rem' }}>
            NEXORA AI is built for individuals who want to better understand their skin health. We serve users looking for:
          </p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {['Quick informational context on a skin concern', 'Preparation before a doctor visit', 'Understanding common skin conditions', 'Tracking skin changes over time'].map((item) => (
              <li key={item} style={{ fontSize: '0.9375rem', color: 'var(--color-slate-600)', paddingLeft: '1.25rem', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--color-teal-500)' }}>✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default About;
