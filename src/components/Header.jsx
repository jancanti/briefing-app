import React from 'react';
import { 
  Download, 
  Copy, 
  RotateCcw, 
  Sun, 
  Moon, 
  Share2,
  FolderCheck,
  Cloud,
  CloudOff,
  User,
  LogOut,
  Sparkles
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { getDisplayUsername } from '../services/authService';

export default function Header({
  headerData,
  theme,
  toggleTheme,
  onReset,
  onCopyMd,
  onDownloadMd,
  saveStatus,
  progressPercentage,
  onOpenShareModal,
  onOpenDashboard,
  onOpenSupabaseConfig,
  currentUser,
  onOpenAuthModal,
  onSignOut
}) {
  // SVG Radial Progress Ring Calculation
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  const displayUser = getDisplayUsername(currentUser);

  return (
    <header className="app-header">
      <div className="header-left">
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
        {/* User Account / Auth Section */}
        {currentUser ? (
          <div className="user-profile-badge">
            <div className="user-avatar" title={`Conectado como @${displayUser}`}>
              <User size={14} />
            </div>
            <span className="user-name">@{displayUser}</span>
            <button
              onClick={onSignOut}
              className="btn-icon-minimal"
              title="Sair da conta"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="btn-bw-outline btn-sm"
            title="Fazer login ou cadastrar"
          >
            <User size={15} />
            <span>Entrar / Cadastrar</span>
          </button>
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

        {/* Compartilhar / Enviar para Cliente */}
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

        {/* Copiar .MD */}
        <button 
          onClick={onCopyMd} 
          className="btn-bw-secondary btn-sm"
          title="Copiar texto em formato Markdown"
        >
          <Copy size={15} />
          <span className="hide-mobile">Copiar .MD</span>
        </button>

        {/* Baixar .MD */}
        <button 
          onClick={onDownloadMd} 
          className="btn-bw-primary btn-sm"
          title="Baixar documento .md"
        >
          <Download size={15} />
          <span>Baixar .MD</span>
        </button>

        {/* Limpar / Reset */}
        <button 
          onClick={onReset} 
          className="btn-icon-minimal text-danger"
          title="Novo Briefing"
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </header>
  );
}
