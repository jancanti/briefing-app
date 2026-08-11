import React from 'react';
import { X, Database, ExternalLink, Code2, CheckCircle2 } from 'lucide-react';

export default function SupabaseConfigModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const sqlSchema = `create table if not exists briefings (
  id text primary key,
  clinic_name text default 'Nova Clínica',
  header_data jsonb default '{}'::jsonb,
  answers jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar acesso público para leitura/escrita
alter table briefings enable row level security;

create policy "Permitir leitura pública" on briefings for select using (true);
create policy "Permitir inserção pública" on briefings for insert with check (true);
create policy "Permitir atualização pública" on briefings for update using (true);
create policy "Permitir deleção pública" on briefings for delete using (true);`;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card, #ffffff)',
        color: 'var(--text-main, #1e293b)',
        borderRadius: '16px',
        padding: '1.75rem',
        maxWidth: '620px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        border: '1px solid var(--border-delicate)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '0.6rem', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderRadius: '10px', color: '#0284c7' }}>
              <Database size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-serif)', margin: 0 }}>
                Configuração do Supabase (Nuvem)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--espresso-muted)', margin: 0 }}>
                Passo a passo para conectar seu banco de dados em 2 minutos
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Passo 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--espresso-slate)', margin: 0 }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--rose-dust)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>1</span>
            Criar projeto no Supabase (Gratuito)
          </h4>
          <p style={{ fontSize: '0.825rem', color: 'var(--espresso-muted)', margin: 0 }}>
            Acesse <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: 'var(--rose-dust)', textDecoration: 'underline' }}>supabase.com <ExternalLink size={12} style={{ display: 'inline' }} /></a>, faça login e crie um projeto novo gratuito.
          </p>
        </div>

        {/* Passo 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--espresso-slate)', margin: 0 }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--rose-dust)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>2</span>
            Criar a tabela de Briefings (SQL)
          </h4>
          <p style={{ fontSize: '0.825rem', color: 'var(--espresso-muted)', margin: 0 }}>
            No Supabase, vá na aba <strong>SQL Editor</strong>, cole o código abaixo e clique em <strong>RUN</strong>:
          </p>
          <pre style={{
            backgroundColor: '#0f172a',
            color: '#38bdf8',
            padding: '0.85rem',
            borderRadius: '8px',
            fontSize: '0.75rem',
            overflowX: 'auto',
            fontFamily: 'monospace'
          }}>
            {sqlSchema}
          </pre>
        </div>

        {/* Passo 3 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--espresso-slate)', margin: 0 }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--rose-dust)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>3</span>
            Adicionar Variáveis de Ambiente no projeto
          </h4>
          <p style={{ fontSize: '0.825rem', color: 'var(--espresso-muted)', margin: 0 }}>
            Vá em <strong>Project Settings ➔ API</strong> no Supabase, copie a URL e a chave anon/public, e adicione no seu arquivo <code>.env</code> (ou nas variáveis da Vercel):
          </p>
          <pre style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-delicate)',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: 'var(--text-main)',
            fontFamily: 'monospace'
          }}>
{`VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui`}
          </pre>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button onClick={onClose} className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
            Entendi!
          </button>
        </div>
      </div>
    </div>
  );
}
