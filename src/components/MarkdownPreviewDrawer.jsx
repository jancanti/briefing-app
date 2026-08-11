import React, { useState } from 'react';
import { Copy, Download, X, FileText, Check, Eye } from 'lucide-react';

export default function MarkdownPreviewDrawer({
  markdownContent,
  onClose,
  onCopy,
  onDownload,
  copied
}) {
  const [viewTab, setViewTab] = useState('formatted'); // 'formatted' | 'raw'

  return (
    <aside className="app-preview animate-fade">
      {/* Drawer Header */}
      <div 
        style={{
          padding: '1.1rem 1.25rem',
          borderBottom: '1px solid var(--border-delicate)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--surface-white)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <FileText size={19} style={{ color: 'var(--rose-dust)' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--espresso-slate)' }}>
            Prévia do Briefing
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button 
            onClick={onCopy} 
            className="btn btn-secondary btn-icon"
            title="Copiar texto do Markdown"
          >
            {copied ? <Check size={16} style={{ color: 'var(--sage-emerald)' }} /> : <Copy size={16} />}
          </button>
          <button 
            onClick={onDownload} 
            className="btn btn-primary btn-icon"
            title="Baixar arquivo .md"
          >
            <Download size={16} />
          </button>
          <button 
            onClick={onClose} 
            className="btn btn-secondary btn-icon"
            title="Fechar prévia"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Toggle View Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-delicate)', backgroundColor: 'var(--surface-hover)' }}>
        <button
          onClick={() => setViewTab('formatted')}
          style={{
            flex: 1,
            padding: '0.6rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            border: 'none',
            borderBottom: viewTab === 'formatted' ? '2px solid var(--rose-dust)' : '2px solid transparent',
            backgroundColor: viewTab === 'formatted' ? 'var(--surface-white)' : 'transparent',
            color: viewTab === 'formatted' ? 'var(--rose-dust)' : 'var(--espresso-muted)',
            cursor: 'pointer',
            transition: 'var(--transition-fast)'
          }}
        >
          Visualização Formatada
        </button>
        <button
          onClick={() => setViewTab('raw')}
          style={{
            flex: 1,
            padding: '0.6rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            border: 'none',
            borderBottom: viewTab === 'raw' ? '2px solid var(--rose-dust)' : '2px solid transparent',
            backgroundColor: viewTab === 'raw' ? 'var(--surface-white)' : 'transparent',
            color: viewTab === 'raw' ? 'var(--rose-dust)' : 'var(--espresso-muted)',
            cursor: 'pointer',
            transition: 'var(--transition-fast)'
          }}
        >
          Código Markdown (.MD)
        </button>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', backgroundColor: 'var(--ivory-cream)' }}>
        {viewTab === 'raw' ? (
          <pre 
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              lineHeight: 1.6,
              color: 'var(--espresso-slate)',
              backgroundColor: 'var(--surface-white)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-delicate)',
              boxShadow: 'var(--shadow-subtle)'
            }}
          >
            {markdownContent}
          </pre>
        ) : (
          <div 
            style={{
              backgroundColor: 'var(--surface-white)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-delicate)',
              boxShadow: 'var(--shadow-subtle)',
              fontSize: '0.88rem',
              lineHeight: 1.65,
              color: 'var(--espresso-slate)'
            }}
          >
            <div style={{ borderBottom: '2px solid var(--rose-dust)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--rose-dust)' }}>
                Documento de Briefing
              </span>
              <h4 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--espresso-slate)' }}>
                {markdownContent.split('\n')[0].replace('# 📋 Documento de Briefing - ', '')}
              </h4>
            </div>

            <div style={{ whiteSpace: 'pre-line' }}>
              {markdownContent}
            </div>
          </div>
        )}
      </div>

      {/* Drawer Footer Actions */}
      <div style={{ padding: '0.9rem 1.25rem', borderTop: '1px solid var(--border-delicate)', backgroundColor: 'var(--surface-white)', display: 'flex', gap: '0.6rem' }}>
        <button onClick={onCopy} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
          {copied ? <Check size={15} style={{ color: 'var(--sage-emerald)' }} /> : <Copy size={15} />}
          <span>{copied ? 'Copiado!' : 'Copiar Markdown'}</span>
        </button>
        <button onClick={onDownload} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
          <Download size={15} />
          <span>Baixar Arquivo .MD</span>
        </button>
      </div>
    </aside>
  );
}
