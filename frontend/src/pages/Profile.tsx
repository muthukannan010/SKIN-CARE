import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, AtSign, Calendar, Edit, Scan, History } from 'lucide-react';
import { profileService } from '../services/profileService';
import { User as UserType } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await profileService.getProfile();
        setProfile(data);
      } catch {
        setError('Failed to load profile data.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) return <LoadingSpinner fullPage label="Loading profile…" />;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="container">
          <h1>My Profile</h1>
          <p>Manage your account information</p>
        </div>
      </div>

      <div className="main-content" style={{ paddingTop: 0 }}>
        <div className="container-narrow" style={{ paddingTop: 0, paddingBottom: '3rem' }}>
          {error && <ErrorMessage message={error} className="mb-4" />}

          {profile && (
            <div className="card">
              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-slate-200)' }}>
                <div className="profile-avatar-wrapper">
                  {profile.profile_image ? (
                    <img src={profile.profile_image} alt={profile.first_name} className="profile-avatar" />
                  ) : (
                    <div className="profile-avatar-placeholder">
                      {profile.first_name?.[0]}{profile.last_name?.[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>
                    {profile.first_name} {profile.last_name}
                  </h2>
                  <p style={{ color: 'var(--color-slate-500)', marginTop: '0.2rem' }}>@{profile.username}</p>
                </div>
                <Link to="/profile/edit" className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }}>
                  <Edit size={15} /> Edit Profile
                </Link>
              </div>

              {/* Info Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { icon: User, label: 'Full Name', value: `${profile.first_name} ${profile.last_name}` },
                  { icon: AtSign, label: 'Username', value: `@${profile.username}` },
                  { icon: Mail, label: 'Email', value: profile.email },
                  { icon: Calendar, label: 'Member Since', value: new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--color-teal-50)', color: 'var(--color-teal-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-slate-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
                      <p style={{ fontWeight: 600, color: 'var(--color-slate-700)' }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-slate-200)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/analyzer" className="btn btn-primary btn-sm"><Scan size={15} /> New Analysis</Link>
                <Link to="/history" className="btn btn-outline btn-sm"><History size={15} /> View History</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
