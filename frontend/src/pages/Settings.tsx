import React from 'react';
import { Link } from 'react-router-dom';
import { Settings as SettingsIcon, Bell, Lock, Trash2 } from 'lucide-react';

const Settings: React.FC = () => (
  <div className="page-wrapper">
    <div className="page-header">
      <div className="container">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><SettingsIcon size={24} /> Settings</h1>
        <p>Manage your account preferences</p>
      </div>
    </div>
    <div className="main-content" style={{ paddingTop: 0 }}>
      <div className="container-narrow" style={{ paddingTop: 0, paddingBottom: '3rem' }}>
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={18} style={{ color: 'var(--color-teal-600)' }} /> Account Security
          </h2>
          <p style={{ color: 'var(--color-slate-500)', fontSize: '0.9375rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            Password changes and security settings are managed through your profile. Contact support if you need to reset your password.
          </p>
          <Link to="/profile/edit" className="btn btn-outline btn-sm">
            <SettingsIcon size={15} /> Edit Profile
          </Link>
        </div>

        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={18} style={{ color: 'var(--color-teal-600)' }} /> Notifications
          </h2>
          <p style={{ color: 'var(--color-slate-500)', fontSize: '0.9375rem' }}>
            Notification preferences will be available in a future update.
          </p>
        </div>

        <div className="card" style={{ border: '1.5px solid var(--color-error-light)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-error)' }}>
            <Trash2 size={18} /> Danger Zone
          </h2>
          <p style={{ color: 'var(--color-slate-500)', fontSize: '0.9375rem', marginBottom: '1.25rem' }}>
            To permanently delete your account and all associated data, contact us via the support page.
          </p>
          <Link to="/contact" className="btn btn-danger btn-sm">Request Account Deletion</Link>
        </div>
      </div>
    </div>
  </div>
);

export default Settings;
