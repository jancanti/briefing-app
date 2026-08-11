import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function ToastNotification({ toast }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />,
    error: <AlertCircle size={18} style={{ color: '#D32F2F' }} />,
    info: <Info size={18} style={{ color: 'var(--accent-rose)' }} />
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        padding: '0.85rem 1.25rem',
        backgroundColor: 'var(--bg-surface)',
        color: 'var(--text-main)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-lg)',
        fontSize: '0.875rem',
        fontWeight: 600,
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      {icons[toast.type] || icons.info}
      <span>{toast.message}</span>
    </div>
  );
}
