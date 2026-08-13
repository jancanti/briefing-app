import React from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Plus, Check } from 'lucide-react';

export default function ModuleForm({
  module,
  answers,
  onAnswerChange,
  onNextModule,
  onPrevModule,
  isFirstModule,
  isLastModule
}) {
  const handleTagClick = (key, tagText) => {
    const currentVal = answers[key] || '';
    if (!currentVal) {
      onAnswerChange(key, tagText);
    } else if (currentVal.includes(tagText)) {
      const updated = currentVal
        .split('\n')
        .filter(line => line.trim() !== tagText && line.trim() !== `- ${tagText}`)
        .join('\n');
      onAnswerChange(key, updated);
    } else {
      onAnswerChange(key, `${currentVal}\n- ${tagText}`);
    }
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '840px', margin: '0 auto', width: '100%' }}>
      {/* Module Title Header */}
      <div style={{ marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
          Módulo do Briefing
        </span>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
          {module.title}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
          {module.description}
        </p>
      </div>

      {/* Questions Form */}
      <form onSubmit={(e) => e.preventDefault()}>
        {module.questions.map((q) => {
          const val = answers[q.key] || '';
          const hasVal = val.trim().length > 0;
          
          return (
            <div 
              key={q.key} 
              style={{
                marginBottom: '2rem',
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                border: hasVal ? '1px solid var(--text-primary)' : '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                transition: 'var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <label htmlFor={q.key} style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {q.label}
                </label>

                {hasVal && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--bg-primary)', backgroundColor: 'var(--text-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                    <Check size={12} strokeWidth={2.5} /> Preenchido
                  </span>
                )}
              </div>

              {q.hint && (
                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '0.9rem', lineHeight: 1.45 }}>
                  {q.hint}
                </p>
              )}

              <textarea
                id={q.key}
                rows={4}
                value={val}
                onChange={(e) => onAnswerChange(q.key, e.target.value)}
                placeholder={q.placeholder}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-family)',
                  lineHeight: '1.5',
                  resize: 'vertical'
                }}
              />

              {/* Quick Tags Suggestions */}
              {q.quickTags && q.quickTags.length > 0 && (
                <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px dashed var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Sparkles size={13} style={{ color: 'var(--text-primary)' }} />
                    <span>Sugestões rápidas (clique para adicionar ao texto):</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                    {q.quickTags.map((tagText, tIdx) => {
                      const isSelected = val.includes(tagText);
                      return (
                        <button
                          type="button"
                          key={tIdx}
                          onClick={() => handleTagClick(q.key, tagText)}
                          style={{
                            padding: '0.35rem 0.7rem',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            borderRadius: 'var(--radius-full)',
                            border: isSelected ? '1px solid var(--text-primary)' : '1px solid var(--border-color)',
                            backgroundColor: isSelected ? 'var(--text-primary)' : 'var(--bg-secondary)',
                            color: isSelected ? 'var(--bg-primary)' : 'var(--text-primary)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            transition: 'var(--transition-fast)'
                          }}
                        >
                          {isSelected ? <Check size={12} strokeWidth={2.5} /> : <Plus size={12} />}
                          <span>{tagText}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Step Navigation Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={onPrevModule}
            disabled={isFirstModule}
            className="btn-bw-secondary"
            style={{ visibility: isFirstModule ? 'hidden' : 'visible' }}
          >
            <ChevronLeft size={18} />
            <span>Módulo Anterior</span>
          </button>

          <button
            type="button"
            onClick={onNextModule}
            className="btn-bw-primary"
          >
            <span>{isLastModule ? 'Concluir Briefing' : 'Próximo Módulo'}</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
