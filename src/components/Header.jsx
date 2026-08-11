import React from 'react';
import { 
  Sparkles, 
  Download, 
  Copy, 
  RotateCcw, 
  Eye, 
  Sun, 
  Moon, 
  CheckCircle2,
  Share2,
  FolderCheck,
  Cloud,
  CloudOff,
  CloudRain,
  Settings
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Header({
  headerData,
  theme,
  toggleTheme,
  onReset,
  onCopyMd,
  onDownloadMd,
  togglePreview,
  showPreview,
  saveStatus,
  progressPercentage,
  onOpenShareModal,
  onOpenDashboard,
  onOpenSupabaseConfig
}) {
  // SVG Radial Ring Calculation
  const radius = 17;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Signature Radial Progress Ring */}
        <div className="progress-ring-box" title={`Progresso total: ${progressPercentage}%`}>
          <svg width="44" height="44" viewBox="0 0 44 44">
            <circle
              cx="22"
              cy="22"
              r={radius}
              stroke="var(--border-delicate)"
              strokeWidth="3"
              fill="transparent"
            />
            <circle
              className="progress-ring-circle"
              cx="22"
              cy="22"
              r={radius}
              stroke="var(--rose-dust)"
              strokeWidth="3"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={16} style={{ color: 'var(--rose-dust)' }} />
          </div>
        </div>

        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-serif)', color: 'var(--espresso-slate)', letterSpacing: '0.01em', lineHeight: 1.1 }}>
            Coletor de Briefing
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.78rem', color: 'var(--espresso-muted)', marginTop: '0.1rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--champagne)' }}>
              {headerData.clinicName || 'Nova Clínica de Estética'}
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--sage-emerald)', fontWeight: 600 }}>
              {isSupabaseConfigured ? (
                <>
                  <Cloud size={13} /> {saveStatus}
                </>
              ) : (
                <button
                  onClick={onOpenSupabaseConfig}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'var(--rose-dust)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.78rem',
                    textDecoration: 'underline'
                  }}
                  title="Clique para conectar com Supabase"
                >
                  <CloudOff size={13} /> Configurar Nuvem (Supabase)
                </button>
              )}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
        {/* Meus Briefings Button */}
        <button
          onClick={onOpenDashboard}
          className="btn btn-secondary btn-sm"
          title="Ver todos os briefings salvos na nuvem"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <FolderCheck size={16} style={{ color: 'var(--rose-dust)' }} />
          <span style={{ display: window.innerWidth < 768 ? 'none' : 'inline' }}>Meus Briefings</span>
        </button>

        {/* Compartilhar / Enviar para Cliente */}
        <button
          onClick={onOpenShareModal}
          className="btn btn-primary btn-sm"
          title="Gerar link único para a cliente preencher"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--rose-dust)', color: '#fff' }}
        >
          <Share2 size={16} />
          <span>Enviar p/ Cliente</span>
        </button>

        <button 
          onClick={toggleTheme} 
          className="btn btn-secondary btn-icon"
          title={theme === 'light' ? 'Alternar para Modo Escuro' : 'Alternar para Modo Claro'}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button 
          onClick={togglePreview} 
          className={`btn ${showPreview ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          title="Alternar prévia em tempo real"
        >
          <Eye size={16} />
          <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>
            {showPreview ? 'Ocultar Prévia' : 'Ver Markdown'}
          </span>
        </button>

        <button 
          onClick={onCopyMd} 
          className="btn btn-secondary btn-sm"
          title="Copiar texto formatado em Markdown"
        >
          <Copy size={16} />
          <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>Copiar .MD</span>
        </button>

        <button 
          onClick={onDownloadMd} 
          className="btn btn-primary btn-sm"
          title="Baixar documento .md para o computador"
        >
          <Download size={16} />
          <span>Baixar .MD</span>
        </button>

        <button 
          onClick={onReset} 
          className="btn btn-danger btn-icon"
          title="Limpar formulário e iniciar novo briefing"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </header>
  );
}
