import React, { useState, useEffect } from 'react';
import { X, Plus, Search, Trash2, Share2, FolderCheck, RefreshCw } from 'lucide-react';
import { listAllBriefingsFromCloud, deleteBriefingFromCloud } from '../services/briefingService';
import { BRIEFING_MODULES } from '../data/briefingModules';

export default function BriefingsDashboardDrawer({
  isOpen,
  onClose,
  currentBriefingId,
  onSelectBriefing,
  onCreateNewBriefing,
  onOpenShareModal,
  showToastNotification,
  currentUser
}) {
  const [briefings, setBriefings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const loadBriefings = async () => {
    setLoading(true);
    const userId = currentUser?.id || null;
    const { data, error } = await listAllBriefingsFromCloud(userId);
    if (!error && data) {
      setBriefings(data);
    } else if (error) {
      if (showToastNotification) {
        showToastNotification('Erro ao carregar lista de briefings da nuvem', 'error');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadBriefings();
    }
  }, [isOpen, currentUser]);

  const handleDelete = async (id, clinicName, e) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja excluir o briefing da clínica "${clinicName}"? Esta ação não pode ser desfeita.`)) {
      const { error } = await deleteBriefingFromCloud(id);
      if (!error) {
        if (showToastNotification) {
          showToastNotification('Briefing excluído com sucesso!', 'success');
        }
        setBriefings(prev => prev.filter(b => b.id !== id));
      } else {
        if (showToastNotification) {
          showToastNotification('Erro ao excluir briefing', 'error');
        }
      }
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
    (b.id || '').toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Top bar */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <FolderCheck size={20} className="text-primary" />
            <div>
              <h3 className="drawer-title">
                Meus Briefings
              </h3>
              <p className="drawer-subtitle">
                {briefings.length} {briefings.length === 1 ? 'briefing salvo' : 'briefings salvos'}
              </p>
            </div>
          </div>
          <div className="drawer-actions">
            <button
              onClick={loadBriefings}
              className="btn-icon-minimal"
              title="Atualizar lista"
            >
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
            </button>
            <button
              onClick={onClose}
              className="btn-icon-minimal"
              aria-label="Fechar gaveta"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Action bar: Search and Create */}
        <div className="drawer-search-bar">
          <div className="input-with-icon flex-1">
            <Search size={16} className="input-icon" />
            <input
              type="text"
              placeholder="Buscar por clínica..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              onCreateNewBriefing();
              onClose();
            }}
            className="btn-bw-primary btn-sm"
          >
            <Plus size={16} />
            <span>Novo</span>
          </button>
        </div>

        {/* Briefings List */}
        <div className="drawer-list">
          {loading && (
            <div className="drawer-empty-state">
              Carregando briefings...
            </div>
          )}

          {!loading && filteredBriefings.length === 0 && (
            <div className="drawer-empty-state">
              {search ? 'Nenhum briefing encontrado para essa busca.' : 'Nenhum briefing salvo na nuvem ainda. Clique em "Novo" para criar um!'}
            </div>
          )}

          {!loading && filteredBriefings.map((b) => {
            const isCurrent = b.id === currentBriefingId;
            const progress = calculateProgress(b.answers);

            return (
              <div
                key={b.id}
                onClick={() => {
                  onSelectBriefing(b.id);
                  onClose();
                }}
                className={`briefing-card-item ${isCurrent ? 'active' : ''}`}
              >
                <div className="card-item-header">
                  <div>
                    <h4 className="card-item-title">
                      {b.clinic_name || 'Clínica Sem Nome'}
                    </h4>
                    <span className="card-item-id">
                      ID: {b.id}
                    </span>
                  </div>
                  {isCurrent && (
                    <span className="badge-active">
                      Atual
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="card-item-progress-block">
                  <div className="progress-info">
                    <span>Progresso: {progress}%</span>
                    <span>{formatDate(b.updated_at)}</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ transform: `scaleX(${progress / 100})` }}
                    />
                  </div>
                </div>

                {/* Card Actions */}
                <div className="card-item-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenShareModal(b.id, b.clinic_name);
                    }}
                    className="btn-bw-secondary btn-xs"
                    title="Compartilhar link com cliente"
                  >
                    <Share2 size={13} />
                    <span>Compartilhar</span>
                  </button>
                  <button
                    onClick={(e) => handleDelete(b.id, b.clinic_name, e)}
                    className="btn-icon-minimal text-danger"
                    title="Excluir briefing"
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
