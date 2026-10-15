import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Camera, CheckCircle } from 'lucide-react';
import { profileService } from '../services/profileService';
import { User, FormErrors, ApiError } from '../types';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const EditProfile: React.FC = () => {
  const { refreshUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<User | null>(null);
  const [form, setForm] = useState({ first_name: '', last_name: '', username: '', email: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const p = await profileService.getProfile();
        setProfile(p);
        setForm({ first_name: p.first_name, last_name: p.last_name, username: p.username, email: p.email });
        if (p.profile_image) setPreviewImage(p.profile_image);
      } catch {
        setApiError('Failed to load profile. Please refresh.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.first_name.trim()) e.first_name = 'First name is required.';
    if (!form.last_name.trim()) e.last_name = 'Last name is required.';
    if (!form.username.trim()) e.username = 'Username is required.';
    else if (!/^[a-zA-Z0-9_]{3,30}$/.test(form.username)) e.username = 'Invalid username format.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setApiError('');
    setSuccess('');
    setIsSaving(true);
    try {
      await profileService.updateProfile(form);
      await refreshUser();
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setApiError((err as ApiError).message || 'Update failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setApiError('Profile image must be JPG, PNG, or WebP.'); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setApiError('Profile image must be under 5 MB.'); return;
    }
    setPreviewImage(URL.createObjectURL(file));
    setIsUploadingImage(true);
    setApiError('');
    try {
      await profileService.updateProfileImage(file);
      await refreshUser();
      setSuccess('Profile photo updated!');
    } catch (err) {
      setApiError((err as ApiError).message || 'Failed to upload image.');
      setPreviewImage(profile?.profile_image || null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const set = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: '' }));
  };

  if (isLoading) return <LoadingSpinner fullPage label="Loading profile…" />;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="container">
          <Link to="/profile" className="btn btn-ghost btn-sm" style={{ marginBottom: '0.75rem' }}>
            <ArrowLeft size={15} /> Back to Profile
          </Link>
          <h1>Edit Profile</h1>
          <p>Update your personal information</p>
        </div>
      </div>

      <div className="main-content" style={{ paddingTop: 0 }}>
        <div className="container-narrow" style={{ paddingTop: 0, paddingBottom: '3rem' }}>
          {apiError && <ErrorMessage message={apiError} className="mb-4" />}
          {success && (
            <div className="success-banner mb-4">
              <CheckCircle size={16} /> {success}
            </div>
          )}

          {/* Avatar Upload */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>Profile Photo</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div className="profile-avatar-wrapper">
                {previewImage ? (
                  <img src={previewImage} alt="Profile" className="profile-avatar" />
                ) : (
                  <div className="profile-avatar-placeholder">
                    {form.first_name?.[0]}{form.last_name?.[0]}
                  </div>
                )}
                <button
                  className="profile-avatar-edit"
                  onClick={() => fileRef.current?.click()}
                  disabled={isUploadingImage}
                  aria-label="Change profile photo"
                >
                  {isUploadingImage
                    ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                    : <Camera size={14} />}
                </button>
              </div>
              <div>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => fileRef.current?.click()}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? 'Uploading…' : 'Change Photo'}
                </button>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-slate-400)', marginTop: '0.4rem' }}>
                  JPG, PNG, or WebP · Max 5 MB
                </p>
              </div>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange} style={{ display: 'none' }} aria-label="Profile image upload" />
            </div>
          </div>

          {/* Info Form */}
          <div className="card">
            <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.5rem' }}>Personal Information</h2>
            <form onSubmit={handleSave} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="first_name" className="form-label">First Name</label>
                  <input id="first_name" type="text" className={`form-input${errors.first_name ? ' error' : ''}`}
                    value={form.first_name} onChange={(e) => set('first_name', e.target.value)} />
                  {errors.first_name && <span className="form-error">{errors.first_name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="last_name" className="form-label">Last Name</label>
                  <input id="last_name" type="text" className={`form-input${errors.last_name ? ' error' : ''}`}
                    value={form.last_name} onChange={(e) => set('last_name', e.target.value)} />
                  {errors.last_name && <span className="form-error">{errors.last_name}</span>}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="username" className="form-label">Username</label>
                <input id="username" type="text" className={`form-input${errors.username ? ' error' : ''}`}
                  value={form.username} onChange={(e) => set('username', e.target.value)} />
                {errors.username && <span className="form-error">{errors.username}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input id="email" type="email" className={`form-input${errors.email ? ' error' : ''}`}
                  value={form.email} onChange={(e) => set('email', e.target.value)} />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? (
                    <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving…</>
                  ) : 'Save Changes'}
                </button>
                <Link to="/profile" className="btn btn-ghost">Cancel</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
