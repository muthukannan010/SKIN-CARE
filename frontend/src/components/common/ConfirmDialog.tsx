import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen, onClose, onConfirm, title, message,
  confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  danger = false, isLoading = false,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
        background: danger ? 'var(--color-error-light)' : 'var(--color-warning-light)',
        color: danger ? 'var(--color-error)' : 'var(--color-warning)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <AlertTriangle size={20} />
      </div>
      <p style={{ fontSize: '0.9375rem', color: 'var(--color-slate-600)', lineHeight: 1.6 }}>{message}</p>
    </div>
    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
      <button className="btn btn-ghost" onClick={onClose} disabled={isLoading}>{cancelLabel}</button>
      <button
        className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
        onClick={onConfirm}
        disabled={isLoading}
      >
        {isLoading ? 'Processing…' : confirmLabel}
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
