import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Normaliza o nome de usuário em um e-mail sintético interno para o Supabase Auth.
 */
export function usernameToEmail(username) {
  if (!username) return '';
  const clean = username.toLowerCase().trim().replace(/[^a-z0-9_.-]/g, '');
  return `${clean}@briefing.app`;
}

/**
 * Cadastra um novo usuário com Nome de Usuário e Senha.
 */
export async function signUpWithUsername(username, password) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: new Error('Supabase não está configurado.') };
  }

  const cleanUser = username.trim();
  if (!cleanUser || cleanUser.length < 3) {
    return { data: null, error: new Error('O nome de usuário deve ter pelo menos 3 caracteres.') };
  }

  if (!password || password.length < 6) {
    return { data: null, error: new Error('A senha deve ter pelo menos 6 caracteres.') };
  }

  const email = usernameToEmail(cleanUser);

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: cleanUser,
        },
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Erro no cadastro:', err);
    return { data: null, error: err };
  }
}

/**
 * Realiza login com Nome de Usuário e Senha.
 */
export async function signInWithUsername(username, password) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: new Error('Supabase não está configurado.') };
  }

  const cleanUser = username.trim();
  if (!cleanUser || !password) {
    return { data: null, error: new Error('Informe o nome de usuário e a senha.') };
  }

  const email = usernameToEmail(cleanUser);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Erro no login:', err);
    return { data: null, error: err };
  }
}

/**
 * Encerra a sessão do usuário.
 */
export async function signOut() {
  if (!isSupabaseConfigured || !supabase) {
    return { error: null };
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (err) {
    console.error('Erro ao sair:', err);
    return { error: err };
  }
}

/**
 * Obtém o usuário atual autenticado.
 */
export async function getCurrentUser() {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    return null;
  }
}

/**
 * Extrai o nome de usuário legível do objeto user.
 */
export function getDisplayUsername(user) {
  if (!user) return '';
  if (user.user_metadata?.username) {
    return user.user_metadata.username;
  }
  if (user.email) {
    return user.email.split('@')[0];
  }
  return 'Usuário';
}

/**
 * Escuta mudanças no estado de autenticação (LOGIN, LOGOUT, INITIAL_SESSION).
 */
export function onAuthStateChange(callback) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }

  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session?.user || null);
  });
}
