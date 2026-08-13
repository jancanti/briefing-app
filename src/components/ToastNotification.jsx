import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function ToastNotification({ toast }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={16} style={{ color: 'var(--text-primary)' }} />,
    error: <AlertCircle size={16} style={{ color: 'var(--danger-color)' }} />,
    info: <Info size={16} style={{ color: 'var(--text-secondary)' }} />
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        padding: '0.75rem 1.15rem',
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-primary)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-lg)',
        fontSize: '0.85rem',
        fontWeight: 600,
        fontFamily: 'var(--font-family)',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      {icons[toast.type] || icons.info}
      <span>{toast.message}</span>
    </div>
  );
}
