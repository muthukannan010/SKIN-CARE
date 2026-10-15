import React from 'react';
import { Shield } from 'lucide-react';

const Privacy: React.FC = () => (
  <div className="page-wrapper">
    <div className="page-header">
      <div className="container">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Shield size={24} /> Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>
    </div>
    <div className="main-content" style={{ paddingTop: 0 }}>
      <div className="container-narrow" style={{ paddingTop: 0, paddingBottom: '4rem' }}>
        <div className="card">
          {[
            { title: '1. Data We Collect', body: 'We collect information you provide during registration (name, username, email, password hash) and images you upload for analysis. We also collect analysis results tied to your account.' },
            { title: '2. How We Use Your Data', body: 'Your data is used solely to provide the NEXORA AI service: authenticating you, performing AI analysis on your images, and storing results in your personal history.' },
            { title: '3. Image Storage', body: 'Uploaded images are processed by our backend AI model. Storage practices depend on your backend configuration. We do not sell or share your images with any third party.' },
            { title: '4. Security', body: 'We use industry-standard security practices including encrypted connections (HTTPS), hashed passwords, and authentication tokens. No system is 100% secure; we recommend using a strong, unique password.' },
            { title: '5. Data Retention', body: 'Your account data and analysis history are retained while your account is active. You can delete individual analyses from your History page. To delete your account entirely, contact us.' },
            { title: '6. Third-Party Services', body: 'NEXORA AI connects to a backend API you control. We do not use Supabase or third-party authentication. Review the backend deployment documentation for infrastructure details.' },
            { title: '7. Medical Information', body: 'AI analysis results are informational only. We do not share health-related results with insurers, employers, or any third party.' },
            { title: '8. Changes', body: 'We may update this policy. Continued use of the service after changes means you accept the updated terms.' },
            { title: '9. Contact', body: 'For privacy questions, use the Contact page. We will respond within 5 business days.' },
          ].map(({ title, body }) => (
            <div key={title} style={{ marginBottom: '1.75rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-slate-800)', marginBottom: '0.5rem' }}>{title}</h2>
              <p style={{ color: 'var(--color-slate-600)', lineHeight: 1.7, fontSize: '0.9375rem' }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Privacy;
