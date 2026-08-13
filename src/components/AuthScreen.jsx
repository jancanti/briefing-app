import React, { useState } from 'react';
import { User, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { signInWithUsername } from '../services/authService';

export default function AuthScreen({ onAuthSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: err } = await signInWithUsername(username, password);
    setLoading(false);

    if (err) {
      setError(
        err.message === 'Invalid login credentials'
          ? 'Nome de usuário ou senha incorretos.'
          : err.message || 'Erro ao realizar login.'
      );
    } else if (data?.user) {
      onAuthSuccess(data.user);
    }
  };

  return (
    <div className="auth-screen-layout">
      <div className="auth-screen-card">
        {/* Header */}
        <div className="auth-screen-brand">
          <h1 className="auth-brand-title">Briefing do site</h1>
          <p className="auth-brand-subtitle">
            Digite seu e-mail e senha para fazer seu briefing
          </p>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="auth-alert auth-alert-error" role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                id="auth-screen-username"
                type="email"
                placeholder="Digite seu e-mail cadastrado"
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
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="auth-screen-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="input-eye-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-auth-primary"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}


