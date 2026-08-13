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
    <aside className="app-sidebar" style={{ width: '280px', borderRight: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column' }}>
      {/* Clinic Header Metadata Form */}
      <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
        <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
          Identificação da Reunião
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
              <Building2 size={13} style={{ color: 'var(--text-primary)' }} /> Nome da Clínica
            </label>
            <input
              type="text"
              name="clinicName"
              value={headerData.clinicName}
              onChange={handleHeaderChange}
              placeholder="Ex: Lumina Estética"
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.83rem'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
              <User size={13} style={{ color: 'var(--text-primary)' }} /> Cliente / Responsável
            </label>
            <input
              type="text"
              name="clientName"
              value={headerData.clientName}
              onChange={handleHeaderChange}
              placeholder="Ex: Dra. Ana Beatriz"
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.83rem'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                <MapPin size={13} style={{ color: 'var(--text-primary)' }} /> Cidade/UF
              </label>
              <input
                type="text"
                name="cityState"
                value={headerData.cityState}
                onChange={handleHeaderChange}
                placeholder="São Paulo/SP"
                style={{
                  width: '100%',
                  padding: '0.5rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                <Calendar size={13} style={{ color: 'var(--text-primary)' }} /> Data
              </label>
              <input
                type="date"
                name="date"
                value={headerData.date}
                onChange={handleHeaderChange}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem'
                }}
              />
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
            <span>Preenchimento Global</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{progressPercentage}%</span>
          </div>
          <div style={{ height: '4px', width: '100%', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: '100%', 
                backgroundColor: 'var(--text-primary)',
                borderRadius: 'var(--radius-full)',
                transformOrigin: 'left',
                transform: `scaleX(${progressPercentage / 100})`,
                transition: 'transform 0.3s ease' 
              }}
            />
          </div>
        </div>
      </div>

      {/* Module Navigation List */}
      <div style={{ padding: '1rem 0.75rem', flex: 1, overflowY: 'auto' }}>
        <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '0 0.5rem', marginBottom: '0.5rem' }}>
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
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '1px solid var(--text-primary)' : '1px solid transparent',
                  backgroundColor: isSelected ? 'var(--bg-primary)' : 'transparent',
                  color: 'var(--text-primary)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <IconComponent size={16} style={{ color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)' }} />
                  <span>{mod.shortTitle}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {isComplete ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                      <Check size={11} strokeWidth={3} />
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-full)', backgroundColor: isSelected ? 'var(--bg-secondary)' : 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 600 }}>
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
