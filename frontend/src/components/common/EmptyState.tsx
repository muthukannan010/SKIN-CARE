import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => (
  <div className="empty-state fade-in">
    {Icon && (
      <div className="empty-state-icon">
        <Icon size={32} />
      </div>
    )}
    <h3>{title}</h3>
    {description && <p style={{ marginTop: '0.5rem', maxWidth: 400, margin: '0.5rem auto 0' }}>{description}</p>}
    {action && <div style={{ marginTop: '1.5rem' }}>{action}</div>}
  </div>
);

export default EmptyState;
