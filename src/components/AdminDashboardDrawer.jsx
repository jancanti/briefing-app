import React, { useState, useEffect } from 'react';
import { X, Search, Trash2, Copy, Download, ShieldCheck, RefreshCw, Check } from 'lucide-react';
import { listAllBriefingsFromCloud, deleteBriefingFromCloud } from '../services/briefingService';
import { BRIEFING_MODULES, generateMarkdown } from '../data/briefingModules';

export default function AdminDashboardDrawer({
  isOpen,
  onClose,
  showToastNotification
}) {
  const [briefings, setBriefings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);

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
    if (isOpen) {
      loadAllBriefings();
    }
  }, [isOpen]);

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
    e.stopPropagation();
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
    e.stopPropagation();
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

  const filteredBriefings = briefings.filter(b => 
    (b.clinic_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (b.id || '').toLowerCase().includes(search.toLowerCase()) ||
    (b.user_id || '').toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="drawer-content admin-drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <ShieldCheck size={22} className="text-primary" />
            <div>
              <h3 className="drawer-title">
                Painel do Administrador
              </h3>
              <p className="drawer-subtitle">
                Acesso global a todos os {briefings.length} briefings da plataforma
              </p>
            </div>
          </div>
          <div className="drawer-actions">
            <button
              onClick={loadAllBriefings}
              className="btn-icon-minimal"
              title="Atualizar lista global"
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

        {/* Search */}
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

        {/* Briefings List */}
        <div className="drawer-list">
          {loading && (
            <div className="drawer-empty-state">
              Carregando lista global de briefings...
            </div>
          )}

          {!loading && filteredBriefings.length === 0 && (
            <div className="drawer-empty-state">
              {search ? 'Nenhum briefing encontrado para essa busca.' : 'Nenhum briefing encontrado na plataforma.'}
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
                      ID: {b.id} {b.user_id ? `• User: ${b.user_id.substring(0, 8)}...` : ''}
                    </span>
                  </div>
                  <span className="badge-count">
                    {progress}% concluído
                  </span>
                </div>

                <div className="card-item-progress-block">
                  <div className="progress-info">
                    <span>Atualizado em: {formatDate(b.updated_at)}</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ transform: `scaleX(${progress / 100})` }}
                    />
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="card-item-actions" style={{ gap: '0.4rem', marginTop: '0.4rem' }}>
                  <button
                    onClick={(e) => handleCopyMd(b, e)}
                    className="btn-bw-secondary btn-xs"
                    title="Copiar texto formatado em Markdown"
                  >
                    {isCopied ? <Check size={13} /> : <Copy size={13} />}
                    <span>{isCopied ? 'Copiado!' : 'Copiar .MD'}</span>
                  </button>

                  <button
                    onClick={(e) => handleDownloadMd(b, e)}
                    className="btn-bw-primary btn-xs"
                    title="Baixar arquivo .MD para o computador"
                  >
                    <Download size={13} />
                    <span>Baixar .MD</span>
                  </button>

                  <button
                    onClick={(e) => handleDelete(b.id, b.clinic_name, e)}
                    className="btn-icon-minimal text-danger"
                    title="Excluir briefing da plataforma"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
