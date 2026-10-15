import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Upload, Cpu, FileText, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: UserPlus, number: 1, title: 'Create a Free Account',
    desc: 'Sign up with your name, email, and a password. No credit card required. Your account lets you securely store and review all your past analyses.',
  },
  {
    icon: Upload, number: 2, title: 'Upload a Skin Image',
    desc: 'Navigate to the Analyzer page and upload a clear, well-lit photo of the skin area you want to examine. Supported formats: JPG, PNG, WebP, BMP up to 10 MB.',
  },
  {
    icon: Cpu, number: 3, title: 'AI Analyzes Your Image',
    desc: 'Our deep learning model processes your image and returns ranked predictions with confidence scores within seconds. The model is running on the backend — your image is securely transmitted.',
  },
  {
    icon: FileText, number: 4, title: 'Review Your Results',
    desc: 'See the top predicted condition, confidence level, description, symptoms, causes, care recommendations, and when to see a doctor. All stored in your history for future reference.',
  },
];

const HowItWorks: React.FC = () => (
  <div className="page-wrapper">
    <div className="page-header" style={{ background: 'linear-gradient(135deg, var(--color-teal-700), var(--color-teal-500))', borderBottom: 'none' }}>
      <div className="container">
        <h1 style={{ color: 'white' }}>How It Works</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.4rem' }}>
          Four simple steps from sign-up to insight
        </p>
      </div>
    </div>
    <div className="main-content" style={{ paddingTop: 0 }}>
      <div className="container-narrow" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
        <div className="steps-list">
          {steps.map(({ icon: Icon, number, title, desc }) => (
            <div key={number} className="step-item">
              <div className="step-number">{number}</div>
              <div className="card step-content" style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div className="feature-icon" style={{ margin: 0, width: 36, height: 36 }}><Icon size={18} /></div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-slate-800)' }}>{title}</h3>
                </div>
                <p style={{ color: 'var(--color-slate-600)', lineHeight: 1.7, fontSize: '0.9375rem' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: '3rem', background: 'var(--color-teal-50)', border: '1.5px solid var(--color-teal-200)', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', marginBottom: '0.5rem' }}>
            Ready to Try It?
          </h2>
          <p style={{ color: 'var(--color-slate-500)', marginBottom: '1.5rem' }}>
            Create your free account and get your first analysis in minutes.
          </p>
          <Link to="/register" className="btn btn-primary">
            Get Started Free <ArrowRight size={16} />
          </Link>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-slate-400)', marginTop: '1rem' }}>
            For informational use only. Not a medical device.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default HowItWorks;
