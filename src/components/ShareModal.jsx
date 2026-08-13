import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, ExternalLink } from 'lucide-react';

export default function ShareModal({ briefingId, clinicName, isOpen, onClose, showToastNotification }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const baseUrl = window.location.origin + window.location.pathname;
  const shareUrl = `${baseUrl}?id=${encodeURIComponent(briefingId)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      if (showToastNotification) {
        showToastNotification('Link do cliente copiado!', 'success');
      }
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleWhatsAppShare = () => {
    const message = `Olá! Por favor, preencha o briefing da clínica no link a seguir:\n\n${shareUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="auth-modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="auth-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
              <Share2 size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                Enviar para a Cliente
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                {clinicName || 'Briefing sem nome'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon-minimal">
            <X size={18} />
          </button>
        </div>

        <div className="auth-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Informação explicativa */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            fontSize: '0.8rem',
            lineHeight: '1.4',
            color: 'var(--text-primary)'
          }}>
            <p style={{ margin: 0 }}>
              <strong>Como funciona:</strong> Envie este link para sua cliente. As respostas preenchidas serão sincronizadas automaticamente na sua conta.
            </p>
          </div>

          {/* Input de URL e Copiar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Link Único do Briefing
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                readOnly
                value={shareUrl}
                style={{
                  flex: 1,
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace'
                }}
              />
              <button
                onClick={handleCopyLink}
                className={copied ? 'btn-bw-primary btn-sm' : 'btn-bw-secondary btn-sm'}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Botões de Ação Direta */}
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
            <button
              onClick={handleWhatsAppShare}
              className="btn-bw-primary btn-sm"
              style={{ flex: 1, padding: '0.65rem' }}
            >
              <MessageCircle size={16} />
              <span>Enviar via WhatsApp</span>
            </button>

            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-bw-secondary btn-sm"
              style={{ padding: '0.65rem 1rem', textDecoration: 'none' }}
            >
              <ExternalLink size={15} />
              <span>Abrir Link</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
