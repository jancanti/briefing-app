import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Check, 
  Copy, 
  ExternalLink,
  Flame
} from 'lucide-react';

export default function FirebaseConfigModal({ isOpen, onClose }) {
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedRules, setCopiedRules] = useState(false);

  if (!isOpen) return null;

  const envTemplate = `# Cole estas variáveis no arquivo .env na raiz do projeto:
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
VITE_FIREBASE_APP_ID=seu-app-id`;

  const rulesCode = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /briefings/{briefingId} {
      allow read, write: if request.auth != null;
    }
  }
}`;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'env') {
      setCopiedEnv(true);
      setTimeout(() => setCopiedEnv(false), 2000);
    } else if (type === 'rules') {
      setCopiedRules(true);
      setTimeout(() => setCopiedRules(false), 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '640px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="share-icon-circle">
              <Flame size={20} />
            </div>
            <div>
              <h2 className="modal-title">Configuração do Firebase (Nuvem)</h2>
              <p className="modal-description">
                Sincronize autenticação e dados de briefings em tempo real
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <div className="instruction-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Criar projeto no Firebase (Gratuito)</h4>
              <p>
                Acesse{' '}
                <a 
                  href="https://console.firebase.google.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ color: 'var(--text-primary)', fontWeight: 600, textDecoration: 'underline' }}
                >
                  console.firebase.google.com <ExternalLink size={11} style={{ display: 'inline' }} />
                </a>{' '}
                e crie um projeto novo.
              </p>
            </div>
          </div>

          <div className="instruction-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Ativar Authentication e Firestore</h4>
              <p>
                - Em <strong>Authentication &gt; Sign-in method</strong>, ative <strong>E-mail/senha</strong>.<br />
                - Em <strong>Firestore Database</strong>, clique em <strong>Criar banco de dados</strong>.
              </p>
            </div>
          </div>

          <div className="instruction-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4>Configurar variáveis no <code>.env</code></h4>
                <button 
                  className="btn-bw-secondary btn-sm"
                  onClick={() => copyToClipboard(envTemplate, 'env')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.6rem' }}
                >
                  {copiedEnv ? <Check size={12} /> : <Copy size={12} />}
                  {copiedEnv ? 'Copiado' : 'Copiar Modelo'}
                </button>
              </div>
              <pre className="sql-box" style={{ maxHeight: '140px' }}>
                <code>{envTemplate}</code>
              </pre>
            </div>
          </div>

          <div className="instruction-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4>Regras de Segurança do Firestore</h4>
                <button 
                  className="btn-bw-secondary btn-sm"
                  onClick={() => copyToClipboard(rulesCode, 'rules')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.6rem' }}
                >
                  {copiedRules ? <Check size={12} /> : <Copy size={12} />}
                  {copiedRules ? 'Copiado' : 'Copiar Regras'}
                </button>
              </div>
              <pre className="sql-box" style={{ maxHeight: '120px' }}>
                <code>{rulesCode}</code>
              </pre>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-bw-primary" onClick={onClose}>
            Entendi, já configurei
          </button>
        </div>
      </div>
    </div>
  );
}
