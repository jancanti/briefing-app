import React from 'react';
import { X, Database, ExternalLink } from 'lucide-react';

export default function SupabaseConfigModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const sqlSchema = `create table if not exists briefings (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  clinic_name text default 'Nova Clínica',
  header_data jsonb default '{}'::jsonb,
  answers jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar Row Level Security (RLS)
alter table briefings enable row level security;

create policy "Permissão de briefings por usuário" on briefings
  for all using (auth.uid() = user_id or user_id is null);`;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="auth-modal-content" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="auth-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
              <Database size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                Configuração do Supabase (Nuvem)
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Passo a passo para conectar seu banco de dados
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon-minimal">
            <X size={18} />
          </button>
        </div>

        <div className="auth-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Passo 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', margin: 0 }}>
              <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>1</span>
              Criar projeto no Supabase (Gratuito)
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Acesse <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)', fontWeight: 600, textDecoration: 'underline' }}>supabase.com <ExternalLink size={11} style={{ display: 'inline' }} /></a>, faça login e crie um projeto novo gratuito.
            </p>
          </div>

          {/* Passo 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', margin: 0 }}>
              <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>2</span>
              Criar a tabela de Briefings (SQL)
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              No Supabase, vá na aba <strong>SQL Editor</strong>, cole o código abaixo e clique em <strong>RUN</strong>:
            </p>
            <pre style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              overflowX: 'auto',
              fontFamily: 'monospace'
            }}>
              {sqlSchema}
            </pre>
          </div>

          {/* Passo 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', margin: 0 }}>
              <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>3</span>
              Adicionar Variáveis de Ambiente
            </h4>
            <pre style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              padding: '0.65rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              fontFamily: 'monospace'
            }}>
{`VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui`}
            </pre>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button onClick={onClose} className="btn-bw-primary btn-sm">
              Concluído
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
