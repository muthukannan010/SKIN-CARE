import React from 'react';
import { Zap, Shield, BarChart3, Clock, Image, FileText, HeartPulse, Smartphone } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Instant AI Analysis', desc: 'Advanced deep learning model processes your image in seconds and returns ranked predictions with confidence scores.', tag: 'Core' },
  { icon: BarChart3, title: 'Ranked Predictions', desc: 'Receive multiple condition predictions ranked by confidence so you can see the full picture the model sees.', tag: 'Core' },
  { icon: FileText, title: 'Detailed Condition Reports', desc: 'Each analysis includes condition description, symptoms, possible causes, supportive care, prevention, and doctor guidance.', tag: 'Information' },
  { icon: Shield, title: 'Privacy-First Design', desc: 'Your images and results are protected. We never share your data with third parties.', tag: 'Privacy' },
  { icon: Clock, title: 'Analysis History', desc: 'Every analysis is saved to your personal history so you can review and track skin changes over time.', tag: 'Tracking' },
  { icon: Image, title: 'Drag & Drop Upload', desc: 'Easy image upload with drag-and-drop support, file picker, and instant preview before submitting.', tag: 'UX' },
  { icon: HeartPulse, title: 'Doctor Guidance', desc: 'Every result includes clear "when to see a doctor" and emergency warning sign sections.', tag: 'Safety' },
  { icon: Smartphone, title: 'Responsive Design', desc: 'Works seamlessly on desktop, tablet, and mobile devices so you can access it anywhere.', tag: 'UX' },
];

const Features: React.FC = () => (
  <div className="page-wrapper">
    <div className="page-header" style={{ background: 'linear-gradient(135deg, var(--color-teal-700), var(--color-teal-500))', borderBottom: 'none' }}>
      <div className="container">
        <h1 style={{ color: 'white' }}>Platform Features</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.4rem' }}>
          Everything you get with NEXORA AI — built for clarity, accuracy, and safety.
        </p>
      </div>
    </div>
    <div className="main-content" style={{ paddingTop: 0 }}>
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
        <div className="features-grid">
          {features.map(({ icon: Icon, title, desc, tag }) => (
            <div key={title} className="card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div className="feature-icon" style={{ margin: 0 }}><Icon size={22} /></div>
                <span className="badge badge-teal">{tag}</span>
              </div>
              <p className="feature-title">{title}</p>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
        <div className="info-box info-box-teal" style={{ marginTop: '2.5rem' }}>
          <Shield size={18} style={{ flexShrink: 0 }} />
          <p>NEXORA AI is an informational tool only, not a medical device. Results must not replace professional medical diagnosis or treatment.</p>
        </div>
      </div>
    </div>
  </div>
);

export default Features;
