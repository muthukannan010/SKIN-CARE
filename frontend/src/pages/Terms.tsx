import React from 'react';
import { FileText } from 'lucide-react';

const Terms: React.FC = () => (
  <div className="page-wrapper">
    <div className="page-header">
      <div className="container">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><FileText size={24} /> Terms of Service</h1>
        <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>
    </div>
    <div className="main-content" style={{ paddingTop: 0 }}>
      <div className="container-narrow" style={{ paddingTop: 0, paddingBottom: '4rem' }}>
        <div className="info-box info-box-red" style={{ marginBottom: '1.5rem' }}>
          <FileText size={18} style={{ flexShrink: 0 }} />
          <p><strong>NEXORA AI IS NOT A MEDICAL DEVICE.</strong> It does not provide medical diagnoses. By using this service, you agree that results are informational only and you will seek professional medical advice for any health concern.</p>
        </div>
        <div className="card">
          {[
            { title: '1. Acceptance', body: 'By using NEXORA AI, you agree to these Terms. If you do not agree, do not use the service.' },
            { title: '2. Informational Use Only', body: 'NEXORA AI provides AI-generated informational content. No result constitutes a medical diagnosis, prognosis, or treatment recommendation. You must not rely on this service instead of professional medical care.' },
            { title: '3. Account Responsibility', body: 'You are responsible for keeping your credentials confidential and for all activity under your account. Notify us immediately if you suspect unauthorized access.' },
            { title: '4. Acceptable Use', body: 'You may only upload images you have the right to upload. Do not upload images of other people without their consent. Do not attempt to reverse-engineer, abuse, or overload the service.' },
            { title: '5. No Warranty', body: 'The service is provided "as is" without warranties of any kind. We do not warrant that analyses are accurate, complete, or suitable for any purpose.' },
            { title: '6. Limitation of Liability', body: 'We are not liable for any health outcomes, decisions, or losses resulting from use of NEXORA AI. Maximum liability is limited to the amount you paid for the service, if any.' },
            { title: '7. Termination', body: 'We may suspend or terminate your account for violation of these terms. You may delete your account at any time via the Contact page.' },
            { title: '8. Changes', body: 'We may update these terms at any time. Continued use after posting constitutes acceptance of the updated terms.' },
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

export default Terms;
