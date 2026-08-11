import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, ExternalLink, Globe } from 'lucide-react';

export default function ShareModal({ briefingId, clinicName, isOpen, onClose, showToastNotification }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // URL amigável do briefing para o cliente
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
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card, #ffffff)',
        color: 'var(--text-main, #1e293b)',
        borderRadius: '16px',
        padding: '1.75rem',
        maxWidth: '520px',
        width: '100%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid var(--border-delicate, #e2e8f0)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              padding: '0.6rem',
              backgroundColor: 'rgba(235, 114, 155, 0.1)',
              borderRadius: '10px',
              color: 'var(--rose-dust, #eb729b)'
            }}>
              <Share2 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', fontFamily: 'var(--font-serif)' }}>
                Enviar para a Cliente
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--espresso-muted, #64748b)' }}>
                {clinicName || 'Briefing sem nome'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-icon"
            style={{ borderRadius: '50%', padding: '0.4rem' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Informação explicativa */}
        <div style={{
          backgroundColor: 'var(--bg-subtle, #f8fafc)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid var(--border-delicate, #e2e8f0)',
          fontSize: '0.875rem',
          lineHeight: '1.4'
        }}>
          <p style={{ margin: 0, color: 'var(--espresso-slate, #334155)' }}>
            ✨ <strong>Como funciona:</strong> Envie o link abaixo para sua cliente. As respostas que ela digitar serão salvas automaticamente na nuvem e você poderá ver todas de casa!
          </p>
        </div>

        {/* Input de URL e Copiar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--espresso-muted)' }}>
            Link Único do Briefing
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              readOnly
              value={shareUrl}
              style={{
                flex: 1,
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid var(--border-delicate)',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '0.875rem',
                fontFamily: 'monospace'
              }}
            />
            <button
              onClick={handleCopyLink}
              className={`btn ${copied ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1rem' }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Botões de Ação Direta */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button
            onClick={handleWhatsAppShare}
            className="btn"
            style={{
              flex: 1,
              backgroundColor: '#25D366',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontWeight: '600',
              padding: '0.7rem'
            }}
          >
            <MessageCircle size={18} />
            Enviar via WhatsApp
          </button>

          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.7rem 1rem'
            }}
          >
            <ExternalLink size={16} />
            Testar Link
          </a>
        </div>
      </div>
    </div>
  );
}
