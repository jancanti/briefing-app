import React from 'react';
import { 
  Sparkles, 
  Stethoscope, 
  UserCheck, 
  Building2, 
  Award, 
  CalendarCheck, 
  Palette, 
  ShieldCheck, 
  Check,
  FileText,
  User,
  MapPin,
  Calendar
} from 'lucide-react';

const ICON_MAP = {
  Sparkles,
  Stethoscope,
  UserCheck,
  Building2,
  Award,
  CalendarCheck,
  Palette,
  ShieldCheck
};

export default function Sidebar({
  modules,
  activeModuleId,
  setActiveModuleId,
  answers,
  headerData,
  setHeaderData,
  progressPercentage
}) {
  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setHeaderData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <aside className="app-sidebar">
      {/* Clinic Header Metadata Form */}
      <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid var(--border-delicate)', backgroundColor: 'var(--surface-white)' }}>
        <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--rose-dust)', marginBottom: '0.85rem' }}>
          Identificação da Reunião
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--espresso-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
              <Building2 size={13} style={{ color: 'var(--champagne)' }} /> Nome da Clínica
            </label>
            <input
              type="text"
              name="clinicName"
              value={headerData.clinicName}
              onChange={handleHeaderChange}
              placeholder="Ex: Clínica Lumina Estética"
              className="form-input"
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.83rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--espresso-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
              <User size={13} style={{ color: 'var(--champagne)' }} /> Cliente / Responsável
            </label>
            <input
              type="text"
              name="clientName"
              value={headerData.clientName}
              onChange={handleHeaderChange}
              placeholder="Ex: Dra. Ana Beatriz"
              className="form-input"
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.83rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--espresso-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                <MapPin size={13} style={{ color: 'var(--champagne)' }} /> Cidade/UF
              </label>
              <input
                type="text"
                name="cityState"
                value={headerData.cityState}
                onChange={handleHeaderChange}
                placeholder="São Paulo/SP"
                className="form-input"
                style={{ padding: '0.5rem 0.65rem', fontSize: '0.82rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--espresso-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                <Calendar size={13} style={{ color: 'var(--champagne)' }} /> Data
              </label>
              <input
                type="date"
                name="date"
                value={headerData.date}
                onChange={handleHeaderChange}
                className="form-input"
                style={{ padding: '0.5rem 0.5rem', fontSize: '0.8rem' }}
              />
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-delicate)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, color: 'var(--espresso-muted)', marginBottom: '0.4rem' }}>
            <span>Preenchimento Global</span>
            <span style={{ color: 'var(--rose-dust)', fontWeight: 700 }}>{progressPercentage}%</span>
          </div>
          <div style={{ height: '5px', width: '100%', backgroundColor: 'var(--border-delicate)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${progressPercentage}%`, 
                background: 'linear-gradient(90deg, var(--rose-dust), var(--champagne))',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)' 
              }}
            />
          </div>
        </div>
      </div>

      {/* Module Navigation List */}
      <div style={{ padding: '1rem 0.75rem', flex: 1 }}>
        <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--espresso-subtle)', padding: '0 0.5rem', marginBottom: '0.5rem' }}>
          Módulos do Briefing
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {modules.map((mod) => {
            const IconComponent = ICON_MAP[mod.icon] || FileText;
            const isSelected = activeModuleId === mod.id;
            
            const totalQ = mod.questions.length;
            const answeredQ = mod.questions.filter(q => (answers[q.key] || '').trim().length > 0).length;
            const isComplete = answeredQ === totalQ && totalQ > 0;

            return (
              <button
                key={mod.id}
                onClick={() => setActiveModuleId(mod.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid',
                  borderColor: isSelected ? 'rgba(200, 169, 126, 0.5)' : 'transparent',
                  backgroundColor: isSelected ? 'var(--surface-white)' : 'transparent',
                  color: isSelected ? 'var(--rose-dust)' : 'var(--espresso-slate)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'var(--transition-fast)',
                  boxShadow: isSelected ? 'var(--shadow-card)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <IconComponent size={18} style={{ color: isSelected ? 'var(--rose-dust)' : 'var(--espresso-muted)' }} />
                  <span>{mod.shortTitle}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {isComplete ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--sage-emerald-light)', color: 'var(--sage-emerald)' }}>
                      <Check size={12} strokeWidth={3} />
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', backgroundColor: isSelected ? 'var(--rose-dust-light)' : 'var(--surface-hover)', color: isSelected ? 'var(--rose-dust)' : 'var(--espresso-muted)', fontWeight: 600 }}>
                      {answeredQ}/{totalQ}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
