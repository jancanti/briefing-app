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
      // Toggle off / remove tag
      const updated = currentVal
        .split('\n')
        .filter(line => line.trim() !== tagText && line.trim() !== `- ${tagText}`)
        .join('\n');
      onAnswerChange(key, updated);
    } else {
      // Append tag on a new line
      onAnswerChange(key, `${currentVal}\n- ${tagText}`);
    }
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Module Title Header */}
      <div style={{ marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-delicate)' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--rose-dust)' }}>
          Módulo do Briefing
        </span>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--espresso-slate)', marginTop: '0.2rem', lineHeight: 1.15 }}>
          {module.title}
        </h2>
        <p style={{ color: 'var(--espresso-muted)', fontSize: '0.95rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
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
              className={`question-card ${hasVal ? 'has-value' : ''}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <label htmlFor={q.key} style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--espresso-slate)', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {q.label}
                </label>

                {hasVal && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--sage-emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'var(--sage-emerald-light)', padding: '0.25rem 0.7rem', borderRadius: 'var(--radius-full)' }}>
                    <Check size={12} strokeWidth={2.5} /> Preenchido
                  </span>
                )}
              </div>

              {q.hint && (
                <p style={{ fontSize: '0.83rem', color: 'var(--espresso-muted)', marginBottom: '0.9rem', lineHeight: 1.45 }}>
                  {q.hint}
                </p>
              )}

              <textarea
                id={q.key}
                className="form-textarea"
                rows={4}
                value={val}
                onChange={(e) => onAnswerChange(q.key, e.target.value)}
                placeholder={q.placeholder}
              />

              {/* Quick Tags Suggestions */}
              {q.quickTags && q.quickTags.length > 0 && (
                <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px dashed var(--border-delicate)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--espresso-subtle)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Sparkles size={13} style={{ color: 'var(--champagne)' }} />
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
                          className={`chip ${isSelected ? 'active' : ''}`}
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

        {/* Footer Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem', paddingTop: '1.75rem', borderTop: '1px solid var(--border-delicate)' }}>
          <button
            type="button"
            onClick={onPrevModule}
            disabled={isFirstModule}
            className="btn btn-secondary"
            style={{ opacity: isFirstModule ? 0.35 : 1, cursor: isFirstModule ? 'not-allowed' : 'pointer' }}
          >
            <ChevronLeft size={18} />
            <span>Módulo Anterior</span>
          </button>

          <button
            type="button"
            onClick={onNextModule}
            className="btn btn-primary"
          >
            <span>{isLastModule ? 'Concluir Briefing' : 'Próximo Módulo'}</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
