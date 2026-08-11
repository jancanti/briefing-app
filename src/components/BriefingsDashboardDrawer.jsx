import React, { useState, useEffect } from 'react';
import { X, Plus, Search, Trash2, ExternalLink, Share2, FolderCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { listAllBriefingsFromCloud, deleteBriefingFromCloud } from '../services/briefingService';
import { BRIEFING_MODULES } from '../data/briefingModules';

export default function BriefingsDashboardDrawer({
  isOpen,
  onClose,
  currentBriefingId,
  onSelectBriefing,
  onCreateNewBriefing,
  onOpenShareModal,
  showToastNotification
}) {
  const [briefings, setBriefings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const loadBriefings = async () => {
    setLoading(true);
    const { data, error } = await listAllBriefingsFromCloud();
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
  }, [isOpen]);

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

  // Funções utilitárias de progresso e cálculo
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
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card, #ffffff)',
        color: 'var(--text-main, #1e293b)',
        width: '100%',
        maxWidth: '480px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 25px rgba(0, 0, 0, 0.15)',
        borderLeft: '1px solid var(--border-delicate, #e2e8f0)',
        animation: 'slideLeft 0.25s ease-out'
      }}>
        {/* Top bar */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-delicate)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FolderCheck size={22} style={{ color: 'var(--rose-dust)' }} />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-serif)', margin: 0 }}>
                Meus Briefings
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--espresso-muted)', margin: 0 }}>
                {briefings.length} {briefings.length === 1 ? 'briefing salvo' : 'briefings salvos na nuvem'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={loadBriefings}
              className="btn btn-secondary btn-icon"
              title="Atualizar lista"
            >
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
            </button>
            <button
              onClick={onClose}
              className="btn btn-secondary btn-icon"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Action bar: Buscar e Criar Novo */}
        <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-delicate)' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--espresso-muted)' }} />
            <input
              type="text"
              placeholder="Buscar por clínica..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem 0.55rem 2.2rem',
                borderRadius: '8px',
                border: '1px solid var(--border-delicate)',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
            />
          </div>
          <button
            onClick={() => {
              onCreateNewBriefing();
              onClose();
            }}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}
          >
            <Plus size={16} />
            Novo
          </button>
        </div>

        {/* Briefings List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {loading && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--espresso-muted)', fontSize: '0.9rem' }}>
              Carregando briefings...
            </div>
          )}

          {!loading && filteredBriefings.length === 0 && (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--espresso-muted)', fontSize: '0.9rem' }}>
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
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  border: isCurrent ? '2px solid var(--rose-dust)' : '1px solid var(--border-delicate)',
                  backgroundColor: isCurrent ? 'rgba(235, 114, 155, 0.04)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--espresso-slate)' }}>
                      {b.clinic_name || 'Clínica Sem Nome'}
                    </h4>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--espresso-muted)' }}>
                      ID: {b.id}
                    </span>
                  </div>
                  {isCurrent && (
                    <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', backgroundColor: 'var(--rose-dust)', color: '#fff', borderRadius: '12px', fontWeight: 600 }}>
                      Atual
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--espresso-muted)', marginBottom: '0.25rem' }}>
                    <span>Progresso: {progress}%</span>
                    <span>Atualizado em: {formatDate(b.updated_at)}</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-delicate)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${progress}%`,
                        height: '100%',
                        backgroundColor: progress === 100 ? 'var(--sage-emerald)' : 'var(--rose-dust)',
                        borderRadius: '3px',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>

                {/* Card Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', marginTop: '0.2rem' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenShareModal(b.id, b.clinic_name);
                    }}
                    className="btn btn-secondary btn-icon btn-sm"
                    title="Compartilhar link com cliente"
                    style={{ padding: '0.3rem 0.6rem' }}
                  >
                    <Share2 size={14} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(b.id, b.clinic_name, e)}
                    className="btn btn-danger btn-icon btn-sm"
                    title="Excluir briefing"
                    style={{ padding: '0.3rem 0.6rem' }}
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
