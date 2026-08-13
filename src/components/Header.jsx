import React from 'react';
import { 
  Cloud,
  CloudOff,
  User,
  LogOut,
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
  onToggleMobileMenu,
  isAdminView = false,
  onCloseAdminView
}) {
  const displayUser = getDisplayUsername(currentUser);
  const isAdmin = isAdminUser(currentUser);

  if (isAdminView) {
    return (
      <header className="app-header">
        <div className="header-left">
          <div className="drawer-title-group">
            <ShieldCheck size={22} className="text-primary" />
            <div>
              <h1 className="header-title">Painel do Administrador</h1>
              <p className="drawer-subtitle">Visão global dos briefings preenchidos pelos clientes</p>
            </div>
          </div>
        </div>

        <div className="header-right">
          <button
            onClick={onCloseAdminView}
            className="btn-bw-secondary btn-sm"
            title="Voltar ao Formulário de Briefing"
          >
            ← Voltar ao Briefing
          </button>

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
        </div>
      </header>
    );
  }

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
        </button>

        <div className="header-title-block">
          <h1 className="header-title">
            Briefing de Clínica
          </h1>
          <div className="header-subtitle-row">
            <span className="header-clinic-name">
              {headerData.clinicName || 'Nova Clínica de Estética'}
            </span>
            <span className="dot-separator">•</span>
            <span className="cloud-status-badge" title={isSupabaseConfigured ? `Status: ${saveStatus}` : "Clique para conectar com Supabase"}>
              {isSupabaseConfigured ? (
                <Cloud size={14} />
              ) : (
                <button
                  onClick={onOpenSupabaseConfig}
                  className="btn-link-cloud"
                  title="Clique para conectar com Supabase"
                >
                  <CloudOff size={14} />
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
      </div>

      {/* Progress Line */}
      <div
        className="header-progress-bar"
        style={{ width: `${progressPercentage}%` }}
        title={`Progresso total: ${progressPercentage}%`}
      />
    </header>
  );
}
