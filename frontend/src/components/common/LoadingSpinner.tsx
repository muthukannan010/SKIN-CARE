import React from 'react';

interface LoadingSpinnerProps {
  fullPage?: boolean;
  size?: number;
  label?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullPage, label = 'Loading…' }) => {
  if (fullPage) {
    return (
      <div style={{
        position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: 'var(--color-white)',
        gap: '1rem', zIndex: 9999
      }}>
        <div className="spinner" />
        <p style={{ color: 'var(--color-slate-500)', fontSize: '0.9rem' }}>{label}</p>
      </div>
    );
  }

  return (
    <div className="spinner-wrapper">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <div className="spinner" />
        <p style={{ color: 'var(--color-slate-500)', fontSize: '0.875rem' }}>{label}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
