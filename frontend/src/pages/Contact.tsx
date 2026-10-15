import React, { useState } from 'react';
import { Mail, MessageSquare, CheckCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.subject.trim()) e.subject = 'Subject is required.';
    if (!form.message.trim()) e.message = 'Message is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  const set = (f: string, v: string) => {
    setForm((p) => ({ ...p, [f]: v }));
    setErrors((p) => ({ ...p, [f]: '' }));
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get in touch with the NEXORA AI team</p>
        </div>
      </div>
      <div className="main-content" style={{ paddingTop: 0 }}>
        <div className="container-narrow" style={{ paddingTop: 0, paddingBottom: '4rem' }}>
          {submitted ? (
            <div className="card text-center" style={{ padding: '3rem' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-success-light)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <CheckCircle size={32} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', marginBottom: '0.5rem' }}>Message Sent!</h2>
              <p style={{ color: 'var(--color-slate-500)' }}>Thanks for reaching out. We'll respond to {form.email} within 2 business days.</p>
            </div>
          ) : (
            <div className="card">
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div className="feature-icon" style={{ margin: 0 }}><MessageSquare size={22} /></div>
                <div>
                  <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Send a Message</h2>
                  <p style={{ color: 'var(--color-slate-500)', fontSize: '0.9rem', marginTop: '0.25rem' }}>For medical concerns, please contact a qualified healthcare professional directly.</p>
                </div>
              </div>
              <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="grid-2">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input id="name" type="text" className={`form-input${errors.name ? ' error' : ''}`} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your full name" />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input id="email" type="email" className={`form-input${errors.email ? ' error' : ''}`} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <input id="subject" type="text" className={`form-input${errors.subject ? ' error' : ''}`} value={form.subject} onChange={(e) => set('subject', e.target.value)} placeholder="What is this about?" />
                  {errors.subject && <span className="form-error">{errors.subject}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea id="message" className={`form-textarea${errors.message ? ' error' : ''}`} rows={5} value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="Your message…" style={{ resize: 'vertical' }} />
                  {errors.message && <span className="form-error">{errors.message}</span>}
                </div>
                <button type="submit" className="btn btn-primary">
                  <Mail size={16} /> Send Message
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
