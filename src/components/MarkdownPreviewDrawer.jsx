import React, { useState } from 'react';
import { Copy, Download, X, FileText, Check } from 'lucide-react';

export default function MarkdownPreviewDrawer({
  markdownContent,
  onClose,
  onCopy,
  onDownload,
  copied
}) {
  const [viewTab, setViewTab] = useState('formatted'); // 'formatted' | 'raw'

  const getDocumentTitle = (md) => {
    if (!md) return 'Documento de Briefing';
    const firstLine = md.split('\n')[0] || '';
    return firstLine
      .replace(/^#\s*/, '')
      .replace(/^[📋\s]*/, '')
      .replace(/^Documento de Briefing\s*-\s*/, '')
      .trim() || 'Documento de Briefing';
  };

  return (
    <aside className="app-preview animate-fade">
      {/* Drawer Header */}
      <div 
        style={{
          padding: '1.1rem 1.25rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-primary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <FileText size={19} style={{ color: 'var(--text-primary)' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-family)', color: 'var(--text-primary)' }}>
            Prévia do Briefing
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button 
            onClick={onCopy} 
            className="btn-bw-secondary btn-xs"
            title="Copiar texto do Markdown"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
          <button 
            onClick={onDownload} 
            className="btn-bw-primary btn-xs"
            title="Baixar arquivo .md"
          >
            <Download size={16} />
          </button>
          <button 
            onClick={onClose} 
            className="btn-icon-minimal"
            title="Fechar prévia"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Toggle View Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
        <button
          onClick={() => setViewTab('formatted')}
          style={{
            flex: 1,
            padding: '0.6rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            border: 'none',
            borderBottom: viewTab === 'formatted' ? '2px solid var(--text-primary)' : '2px solid transparent',
            backgroundColor: viewTab === 'formatted' ? 'var(--bg-primary)' : 'transparent',
            color: viewTab === 'formatted' ? 'var(--text-primary)' : 'var(--text-muted)',
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
            fontSize: '0.75rem',
            fontWeight: 600,
            border: 'none',
            borderBottom: viewTab === 'raw' ? '2px solid var(--text-primary)' : '2px solid transparent',
            backgroundColor: viewTab === 'raw' ? 'var(--bg-primary)' : 'transparent',
            color: viewTab === 'raw' ? 'var(--text-primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'var(--transition-fast)'
          }}
        >
          Código Markdown (.MD)
        </button>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', backgroundColor: 'var(--bg-tertiary)' }}>
        {viewTab === 'raw' ? (
          <pre 
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              lineHeight: 1.6,
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-primary)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {markdownContent}
          </pre>
        ) : (
          <div 
            style={{
              backgroundColor: 'var(--bg-primary)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
              fontSize: '0.9rem',
              lineHeight: 1.65,
              color: 'var(--text-primary)'
            }}
          >
            <div style={{ borderBottom: '2px solid var(--text-primary)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Documento de Briefing
              </span>
              <h4 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-family)', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {getDocumentTitle(markdownContent)}
              </h4>
            </div>

            <div style={{ whiteSpace: 'pre-line' }}>
              {markdownContent}
            </div>
          </div>
        )}
      </div>

      {/* Drawer Footer Actions */}
      <div style={{ padding: '0.9rem 1.25rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', display: 'flex', gap: '0.6rem' }}>
        <button onClick={onCopy} className="btn-bw-secondary btn-sm" style={{ flex: 1 }}>
          {copied ? <Check size={15} /> : <Copy size={15} />}
          <span>{copied ? 'Copiado!' : 'Copiar Markdown'}</span>
        </button>
        <button onClick={onDownload} className="btn-bw-primary btn-sm" style={{ flex: 1 }}>
          <Download size={15} />
          <span>Baixar Arquivo .MD</span>
        </button>
      </div>
    </aside>
  );
}
