import React, { useState, useEffect } from 'react';
import { X, Search, Trash2, Copy, Download, ShieldCheck, RefreshCw, Check, Eye, FileText, Edit3 } from 'lucide-react';
import { listAllBriefingsFromCloud, deleteBriefingFromCloud } from '../services/briefingService';
import { BRIEFING_MODULES, generateMarkdown } from '../data/briefingModules';

export default function AdminDashboardDrawer({
  isOpen,
  onClose,
  showToastNotification,
  isFullPage = false,
  onEditBriefing
}) {
  const [briefings, setBriefings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [previewBriefing, setPreviewBriefing] = useState(null);
  const [previewTab, setPreviewTab] = useState('formatted');

  const loadAllBriefings = async () => {
    setLoading(true);
    // Pass null as userId to fetch ALL briefings globally as Admin
    const { data, error } = await listAllBriefingsFromCloud(null);
    if (!error && data) {
      setBriefings(data);
    } else if (error) {
      if (showToastNotification) {
        showToastNotification('Erro ao carregar briefings no Painel Admin', 'error');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen || isFullPage) {
      loadAllBriefings();
    }
  }, [isOpen, isFullPage]);

  const handleDelete = async (id, clinicName, e) => {
    e.stopPropagation();
    if (window.confirm(`[ADMIN] Deseja excluir permanentemente o briefing da clínica "${clinicName}"?`)) {
      const { error } = await deleteBriefingFromCloud(id);
      if (!error) {
        if (showToastNotification) {
          showToastNotification('Briefing excluído com sucesso pelo Admin!', 'success');
        }
        setBriefings(prev => prev.filter(b => b.id !== id));
      } else {
        if (showToastNotification) {
          showToastNotification('Erro ao excluir briefing', 'error');
        }
      }
    }
  };

  const handleCopyMd = async (briefing, e) => {
    if (e) e.stopPropagation();
    try {
      const mdContent = generateMarkdown(briefing.header_data || {}, briefing.answers || {});
      await navigator.clipboard.writeText(mdContent);
      setCopiedId(briefing.id);
      if (showToastNotification) {
        showToastNotification(`Markdown da clínica "${briefing.clinic_name}" copiado!`, 'success');
      }
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      if (showToastNotification) {
        showToastNotification('Erro ao copiar Markdown', 'error');
      }
    }
  };

  const handleDownloadMd = (briefing, e) => {
    if (e) e.stopPropagation();
    const mdContent = generateMarkdown(briefing.header_data || {}, briefing.answers || {});
    const clinicName = briefing.clinic_name || 'clinica';
    const filename = `briefing_${clinicName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (showToastNotification) {
      showToastNotification(`Arquivo "${filename}" baixado!`, 'success');
    }
  };

  const calculateProgress = (answers) => {
    if (!answers) return 0;
    const allQuestions = BRIEFING_MODULES.flatMap(m => m.questions);
    const totalCount = allQuestions.length;
    const answeredCount = allQuestions.filter(q => (answers[q.key] || '').trim().length > 0).length;
    return Math.round((answeredCount / totalCount) * 100);
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const hasAnswers = (b) => {
    if (!b.answers) return false;
    return Object.values(b.answers).some(val => typeof val === 'string' && val.trim().length > 0);
  };

  const completedBriefings = briefings.filter(hasAnswers);

  const filteredBriefings = completedBriefings.filter(b => 
    (b.clinic_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (b.id || '').toLowerCase().includes(search.toLowerCase()) ||
    (b.user_id || '').toLowerCase().includes(search.toLowerCase())
  );

  const renderBriefingCards = () => (
    <div className="drawer-list" style={{ padding: isFullPage ? 0 : undefined }}>
      {loading && (
        <div className="drawer-empty-state">
          Carregando briefings feitos...
        </div>
      )}

      {!loading && filteredBriefings.length === 0 && (
        <div className="drawer-empty-state">
          {search ? 'Nenhum briefing encontrado para essa busca.' : 'Nenhum briefing preenchido encontrado.'}
        </div>
      )}

      {!loading && filteredBriefings.map((b) => {
        const progress = calculateProgress(b.answers);
        const isCopied = copiedId === b.id;

        return (
          <div key={b.id} className="briefing-card-item">
            <div className="card-item-header">
              <div>
                <h4 className="card-item-title">
                  {b.clinic_name || 'Clínica Sem Nome'}
                </h4>
                <span className="card-item-id">
                  ID: {b.id} {b.header_data?.responsibleEmail ? `• Email: ${b.header_data.responsibleEmail}` : (b.user_id ? `• User: ${b.user_id.substring(0, 8)}...` : '')}
                </span>
              </div>
              <span className="badge-count">
                {progress}% preenchido
              </span>
            </div>

            <div className="card-item-progress-block">
              <div className="progress-info">
                <span>Preenchido em: {formatDate(b.updated_at)}</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ transform: `scaleX(${progress / 100})` }}
                />
              </div>
            </div>

            {/* 4 Actions: EDITAR, VISUALIZAR, COPIAR, SALVAR .MD */}
            <div className="card-item-actions" style={{ gap: '0.4rem', marginTop: '0.65rem' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onEditBriefing) onEditBriefing(b);
                }}
                className="btn-bw-primary btn-sm flex-1"
                title="Editar respostas deste briefing no formulário"
              >
                <Edit3 size={14} />
                <span>EDITAR</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewBriefing(b);
                }}
                className="btn-bw-secondary btn-sm flex-1"
                title="Visualizar documento formatado"
              >
                <Eye size={14} />
                <span>VISUALIZAR</span>
              </button>

              <button
                onClick={(e) => handleCopyMd(b, e)}
                className="btn-bw-secondary btn-sm flex-1"
                title="Copiar texto formatado em Markdown"
              >
                {isCopied ? <Check size={14} /> : <Copy size={14} />}
                <span>{isCopied ? 'Copiado!' : 'COPIAR'}</span>
              </button>

              <button
                onClick={(e) => handleDownloadMd(b, e)}
                className="btn-bw-secondary btn-sm flex-1"
                title="Salvar arquivo .MD no computador"
              >
                <Download size={14} />
                <span>SALVAR .MD</span>
              </button>

              <button
                onClick={(e) => handleDelete(b.id, b.clinic_name, e)}
                className="btn-icon-minimal text-danger"
                title="Excluir briefing"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderPreviewModal = () => {
    if (!previewBriefing) return null;
    const mdContent = generateMarkdown(previewBriefing.header_data || {}, previewBriefing.answers || {});
    const isCopied = copiedId === previewBriefing.id;

    return (
      <div className="drawer-backdrop" onClick={() => setPreviewBriefing(null)} style={{ zIndex: 300 }}>
        <div 
          className="admin-preview-modal" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="drawer-header">
            <div className="drawer-title-group">
              <FileText size={20} className="text-primary" />
              <div>
                <h3 className="drawer-title">
                  {previewBriefing.clinic_name || 'Briefing da Clínica'}
                </h3>
                <p className="drawer-subtitle">
                  ID: {previewBriefing.id} • Atualizado em {formatDate(previewBriefing.updated_at)}
                </p>
              </div>
            </div>

            <div className="drawer-actions">
              <button
                onClick={(e) => handleCopyMd(previewBriefing, e)}
                className="btn-bw-secondary btn-sm"
              >
                {isCopied ? <Check size={14} /> : <Copy size={14} />}
                <span>{isCopied ? 'Copiado!' : 'Copiar .MD'}</span>
              </button>

              <button
                onClick={(e) => handleDownloadMd(previewBriefing, e)}
                className="btn-bw-primary btn-sm"
              >
                <Download size={14} />
                <span>Baixar .MD</span>
              </button>

              <button
                onClick={() => setPreviewBriefing(null)}
                className="btn-icon-minimal"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
            <button
              onClick={() => setPreviewTab('formatted')}
              style={{
                flex: 1,
                padding: '0.6rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: 'none',
                borderBottom: previewTab === 'formatted' ? '2px solid var(--text-primary)' : '2px solid transparent',
                backgroundColor: previewTab === 'formatted' ? 'var(--bg-primary)' : 'transparent',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              Visualização Formatada
            </button>
            <button
              onClick={() => setPreviewTab('raw')}
              style={{
                flex: 1,
                padding: '0.6rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: 'none',
                borderBottom: previewTab === 'raw' ? '2px solid var(--text-primary)' : '2px solid transparent',
                backgroundColor: previewTab === 'raw' ? 'var(--bg-primary)' : 'transparent',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              Código Markdown (.MD)
            </button>
          </div>

          <div className="admin-preview-content">
            {previewTab === 'raw' ? (
              <pre className="admin-preview-code">
                {mdContent}
              </pre>
            ) : (
              <div className="admin-preview-formatted">
                {mdContent.split('\n').map((line, idx) => {
                  if (line.startsWith('# ')) {
                    return <h2 key={idx} style={{ fontSize: '1.25rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>{line.replace('# ', '')}</h2>;
                  }
                  if (line.startsWith('## ')) {
                    return <h3 key={idx} style={{ fontSize: '1.05rem', marginTop: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{line.replace('## ', '')}</h3>;
                  }
                  if (line.startsWith('### ')) {
                    return <h4 key={idx} style={{ fontSize: '0.9rem', marginTop: '0.85rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>{line.replace('### ', '')}</h4>;
                  }
                  if (line.startsWith('> ')) {
                    return <blockquote key={idx} style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '0.75rem', color: 'var(--text-muted)', fontSize: '0.75rem', margin: '0.25rem 0' }}>{line.replace('> ', '')}</blockquote>;
                  }
                  if (line === '---') {
                    return <hr key={idx} style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />;
                  }
                  if (!line.trim()) return <br key={idx} />;
                  return <p key={idx} style={{ fontSize: '0.9rem', lineHeight: '1.6', margin: '0.2rem 0' }}>{line}</p>;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Full Page Standalone View (Option A)
  if (isFullPage) {
    return (
      <main className="admin-fullpage-container">
        <div className="admin-fullpage-header">
          <div className="drawer-search-bar" style={{ padding: 0, border: 'none', width: '100%' }}>
            <div className="input-with-icon flex-1">
              <Search size={16} className="input-icon" />
              <input
                type="text"
                placeholder="Buscar por clínica, ID ou Usuário..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={loadAllBriefings}
              className="btn-bw-secondary btn-sm"
              title="Atualizar lista"
            >
              <RefreshCw size={15} className={loading ? 'spin' : ''} />
              <span>Atualizar</span>
            </button>
          </div>
        </div>

        {renderBriefingCards()}
        {renderPreviewModal()}
      </main>
    );
  }

  if (!isOpen) return null;

  // Drawer Overlay Mode
  return (
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="drawer-content admin-drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-group">
            <ShieldCheck size={22} className="text-primary" />
            <div>
              <h3 className="drawer-title">
                Painel Admin - Briefings Feitos
              </h3>
              <p className="drawer-subtitle">
                {completedBriefings.length} briefings preenchidos por clientes
              </p>
            </div>
          </div>
          <div className="drawer-actions">
            <button
              onClick={loadAllBriefings}
              className="btn-icon-minimal"
              title="Atualizar lista"
            >
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
            </button>
            <button
              onClick={onClose}
              className="btn-icon-minimal"
              aria-label="Fechar painel admin"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="drawer-search-bar">
          <div className="input-with-icon flex-1">
            <Search size={16} className="input-icon" />
            <input
              type="text"
              placeholder="Buscar por clínica, ID ou Usuário..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {renderBriefingCards()}
        {renderPreviewModal()}
      </div>
    </div>
  );
}
