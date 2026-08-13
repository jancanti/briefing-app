import React from 'react';
import { 
  Sun, 
  Moon, 
  Share2,
  FolderCheck,
  Cloud,
  CloudOff,
  User,
  LogOut,
  Sparkles,
  Menu,
  ShieldCheck
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { getDisplayUsername, isAdminUser } from '../services/authService';

export default function Header({
  headerData,
  theme,
  toggleTheme,
  onReset,
  saveStatus,
  progressPercentage,
  onOpenShareModal,
  onOpenDashboard,
  onOpenAdminDashboard,
  onOpenSupabaseConfig,
  currentUser,
  onSignOut,
  onToggleMobileMenu
}) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  const displayUser = getDisplayUsername(currentUser);
  const isAdmin = isAdminUser(currentUser);

  return (
    <header className="app-header">
      <div className="header-left">
        {/* Mobile Navigation Menu Toggle */}
        <button
          onClick={onToggleMobileMenu}
          className="btn-bw-secondary btn-sm mobile-menu-btn"
          title="Ver Módulos do Briefing"
        >
          <Menu size={16} />
          <span>Módulos</span>
        </button>

        {/* Progress Ring */}
        <div className="progress-ring-box" title={`Progresso total: ${progressPercentage}%`}>
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle
              cx="20"
              cy="20"
              r={radius}
              stroke="var(--border-color)"
              strokeWidth="2.5"
              fill="transparent"
            />
            <circle
              className="progress-ring-circle"
              cx="20"
              cy="20"
              r={radius}
              stroke="var(--text-primary)"
              strokeWidth="2.5"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="square"
              fill="transparent"
            />
          </svg>
          <div className="progress-ring-inner">
            <Sparkles size={14} style={{ color: 'var(--text-primary)' }} />
          </div>
        </div>

        <div className="header-title-block">
          <h1 className="header-title">
            Briefing de Clínica
          </h1>
          <div className="header-subtitle-row">
            <span className="header-clinic-name">
              {headerData.clinicName || 'Nova Clínica de Estética'}
            </span>
            <span className="dot-separator">•</span>
            <span className="cloud-status-badge">
              {isSupabaseConfigured ? (
                <>
                  <Cloud size={12} /> {saveStatus}
                </>
              ) : (
                <button
                  onClick={onOpenSupabaseConfig}
                  className="btn-link-cloud"
                  title="Clique para conectar com Supabase"
                >
                  <CloudOff size={12} /> Configurar Nuvem
                </button>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="header-right">
        {/* Admin Dashboard Button (Only for jancanti@gmail.com) */}
        {isAdmin && (
          <button
            onClick={onOpenAdminDashboard}
            className="btn-bw-primary btn-sm"
            title="Abrir Painel do Administrador (Global)"
          >
            <ShieldCheck size={15} />
            <span>Painel Admin</span>
          </button>
        )}

        {/* User Profile Badge */}
        {currentUser && (
          <div className="user-profile-badge" title={`Conectado como @${displayUser}`}>
            <div className="user-avatar">
              <User size={14} />
            </div>
            <span className="user-name">@{displayUser}</span>
            <button
              onClick={onSignOut}
              className="btn-icon-minimal text-danger"
              title="Sair da conta"
            >
              <LogOut size={15} />
            </button>
          </div>
        )}

        {/* Meus Briefings Button */}
        <button
          onClick={onOpenDashboard}
          className="btn-bw-secondary btn-sm"
          title="Ver todos os seus briefings salvos"
        >
          <FolderCheck size={15} />
          <span className="hide-mobile">Meus Briefings</span>
        </button>

        {/* Compartilhar Button */}
        <button
          onClick={onOpenShareModal}
          className="btn-bw-secondary btn-sm"
          title="Gerar link amigável para preenchimento"
        >
          <Share2 size={15} />
          <span className="hide-mobile">Compartilhar</span>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          className="btn-icon-minimal"
          title={theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </header>
  );
}
