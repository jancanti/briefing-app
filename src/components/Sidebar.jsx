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
  Calendar,
  X
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
  progressPercentage,
  isMobileMenuOpen,
  onCloseMobileMenu
}) {
  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setHeaderData(prev => ({ ...prev, [name]: value }));
  };

  const sidebarContent = (
    <div className="sidebar-inner">
      {/* Clinic Header Metadata Form */}
      <div className="sidebar-header-section">
        <div className="sidebar-title-row">
          <h3 className="sidebar-section-title">
            Identificação da Reunião
          </h3>
          {isMobileMenuOpen && (
            <button onClick={onCloseMobileMenu} className="btn-icon-minimal mobile-only">
              <X size={18} />
            </button>
          )}
        </div>
        
        <div className="sidebar-fields-grid">
          <div>
            <label className="sidebar-field-label">
              <Building2 size={13} /> Nome da Clínica
            </label>
            <input
              type="text"
              name="clinicName"
              value={headerData.clinicName}
              onChange={handleHeaderChange}
              placeholder="Ex: Lumina Estética"
              className="sidebar-input"
            />
          </div>

          <div>
            <label className="sidebar-field-label">
              <User size={13} /> Cliente / Responsável
            </label>
            <input
              type="text"
              name="clientName"
              value={headerData.clientName}
              onChange={handleHeaderChange}
              placeholder="Ex: Dra. Ana Beatriz"
              className="sidebar-input"
            />
          </div>

          <div className="sidebar-row-2col">
            <div>
              <label className="sidebar-field-label">
                <MapPin size={13} /> Cidade/UF
              </label>
              <input
                type="text"
                name="cityState"
                value={headerData.cityState}
                onChange={handleHeaderChange}
                placeholder="São Paulo/SP"
                className="sidebar-input"
              />
            </div>

            <div>
              <label className="sidebar-field-label">
                <Calendar size={13} /> Data
              </label>
              <input
                type="date"
                name="date"
                value={headerData.date}
                onChange={handleHeaderChange}
                className="sidebar-input"
              />
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="sidebar-progress-section">
          <div className="sidebar-progress-labels">
            <span>Preenchimento Global</span>
            <span className="sidebar-progress-pct">{progressPercentage}%</span>
          </div>
          <div className="sidebar-progress-track">
            <div 
              className="sidebar-progress-fill"
              style={{ transform: `scaleX(${progressPercentage / 100})` }}
            />
          </div>
        </div>
      </div>

      {/* Module Navigation List */}
      <div className="sidebar-nav-section">
        <h4 className="sidebar-nav-header">
          Módulos do Briefing
        </h4>

        <div className="sidebar-modules-list">
          {modules.map((mod) => {
            const IconComponent = ICON_MAP[mod.icon] || FileText;
            const isSelected = activeModuleId === mod.id;
            
            const totalQ = mod.questions.length;
            const answeredQ = mod.questions.filter(q => (answers[q.key] || '').trim().length > 0).length;
            const isComplete = answeredQ === totalQ && totalQ > 0;

            return (
              <button
                key={mod.id}
                onClick={() => {
                  setActiveModuleId(mod.id);
                  if (onCloseMobileMenu) onCloseMobileMenu();
                }}
                className={`sidebar-module-btn ${isSelected ? 'active' : ''}`}
              >
                <div className="module-btn-label">
                  <IconComponent size={16} />
                  <span>{mod.shortTitle}</span>
                </div>

                <div className="module-btn-status">
                  {isComplete ? (
                    <span className="badge-complete">
                      <Check size={11} strokeWidth={3} />
                    </span>
                  ) : (
                    <span className="badge-count">
                      {answeredQ}/{totalQ}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sticky Sidebar */}
      <aside className="app-sidebar desktop-sidebar">
        {sidebarContent}
      </aside>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="drawer-backdrop mobile-drawer" onClick={onCloseMobileMenu}>
          <div className="drawer-content mobile-sidebar-drawer" onClick={(e) => e.stopPropagation()}>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
