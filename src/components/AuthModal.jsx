import React, { useState } from 'react';
import { X, User, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { signInWithUsername, signUpWithUsername } from '../services/authService';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    if (mode === 'login') {
      const { data, error: err } = await signInWithUsername(username, password);
      setLoading(false);

      if (err) {
        setError(err.message === 'Invalid login credentials' 
          ? 'Nome de usuário ou senha incorretos.' 
          : err.message || 'Erro ao realizar login.');
      } else if (data?.user) {
        if (onAuthSuccess) onAuthSuccess(data.user);
        onClose();
      }
    } else {
      const { data, error: err } = await signUpWithUsername(username, password);
      setLoading(false);

      if (err) {
        setError(err.message || 'Erro ao cadastrar usuário.');
      } else {
        setSuccessMsg('Conta criada com sucesso! Faça login para continuar.');
        setMode('login');
        setPassword('');
      }
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <div className="auth-brand-badge">
            <span className="auth-brand-dot"></span>
            <span>Acesso Seguro</span>
          </div>
          <button 
            className="btn-icon-minimal" 
            onClick={onClose} 
            aria-label="Fechar modal de autenticação"
          >
            <X size={18} />
          </button>
        </div>

        <div className="auth-modal-body">
          <h2 className="auth-title">
            {mode === 'login' ? 'Entrar no Sistema' : 'Criar Nova Conta'}
          </h2>
          <p className="auth-subtitle">
            {mode === 'login' 
              ? 'Informe seu nome de usuário e senha para gerenciar seus briefings.' 
              : 'Defina um nome de usuário e senha para acessar seus briefings de qualquer dispositivo.'}
          </p>

          <div className="auth-tabs" role="tablist">
            <button
              role="tab"
              aria-selected={mode === 'login'}
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }}
            >
              Entrar
            </button>
            <button
              role="tab"
              aria-selected={mode === 'signup'}
              className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => { setMode('signup'); setError(null); setSuccessMsg(null); }}
            >
              Cadastrar
            </button>
          </div>

          {error && (
            <div className="auth-alert auth-alert-error" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="auth-alert auth-alert-success" role="status">
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="auth-username">Nome de Usuário</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  id="auth-username"
                  type="text"
                  placeholder="ex: clinica_estetica"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                  autoCapitalize="none"
                  autoCorrect="off"
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="auth-password">Senha</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  id="auth-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button type="submit" className="btn-bw-primary btn-full" disabled={loading}>
              {loading ? (
                <span>Aguarde...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Entrar' : 'Criar Conta'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
