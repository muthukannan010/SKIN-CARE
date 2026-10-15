import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => (
  <div className={`error-banner ${className}`} role="alert" aria-live="polite">
    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
    <span>{message}</span>
  </div>
);

export default ErrorMessage;
