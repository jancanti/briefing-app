import React, { useState } from 'react';
import { User, Lock, ArrowRight, AlertCircle, CheckCircle2, Sparkles, Eye, EyeOff } from 'lucide-react';
import { signInWithUsername, signUpWithUsername } from '../services/authService';

export default function AuthScreen({ onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

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
        onAuthSuccess(data.user);
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
    <div className="auth-screen-layout">
      <div className="auth-screen-card">
        {/* Pure Luxury Brand Crest & Title */}
        <div className="auth-screen-brand">
          <div className="auth-brand-crest">
            <Sparkles size={22} />
          </div>
          <h1 className="auth-brand-title">Briefing de Clínica</h1>
        </div>

        {/* Tab Selector */}
        <div className="auth-screen-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={mode === 'login'}
            className={`auth-screen-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }}
          >
            Entrar
          </button>
          <button
            role="tab"
            aria-selected={mode === 'signup'}
            className={`auth-screen-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setError(null); setSuccessMsg(null); }}
          >
            Criar Conta
          </button>
        </div>

        {/* Alert Feedback */}
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

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="auth-screen-username">Nome de Usuário</label>
            <div className="input-with-icon">
              <User size={16} className="input-icon" />
              <input
                id="auth-screen-username"
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
            <label htmlFor="auth-screen-password">Senha</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                id="auth-screen-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="input-eye-btn"
                onClick={() => setShowPassword(prev => !prev)}
                title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-bw-primary btn-full" disabled={loading}>
            {loading ? (
              <span>Aguarde...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Acessar Briefings' : 'Cadastrar e Acessar'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
