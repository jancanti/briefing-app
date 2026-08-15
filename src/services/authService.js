import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';

/**
 * Normaliza o nome de usuário em um e-mail sintético interno para o Firebase Auth.
 */
export function usernameToEmail(username) {
  if (!username) return '';
  const clean = username.trim();
  if (clean.includes('@')) {
    return clean;
  }
  const cleanUser = clean.toLowerCase().replace(/[^a-z0-9_.-]/g, '');
  return `${cleanUser}@briefing.app`;
}

/**
 * Cadastra um novo usuário com Nome de Usuário e Senha no Firebase.
 */
export async function signUpWithUsername(username, password) {
  if (!isFirebaseConfigured || !auth) {
    return { data: null, error: new Error('Firebase não está configurado.') };
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
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Define o nome de usuário como displayName no Firebase Auth
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: cleanUser,
      });
    }

    return { data: { user: normalizeUser(userCredential.user) }, error: null };
  } catch (err) {
    console.error('Erro no cadastro:', err);
    let message = err.message;
    if (err.code === 'auth/email-already-in-use') {
      message = 'Este nome de usuário já está em uso.';
    } else if (err.code === 'auth/weak-password') {
      message = 'A senha deve ter no mínimo 6 caracteres.';
    } else if (err.code === 'auth/invalid-email') {
      message = 'Nome de usuário inválido.';
    }
    return { data: null, error: new Error(message) };
  }
}

/**
 * Realiza login com Nome de Usuário e Senha no Firebase.
 */
export async function signInWithUsername(username, password) {
  if (!isFirebaseConfigured || !auth) {
    return { data: null, error: new Error('Firebase não está configurado.') };
  }

  const cleanUser = username.trim();
  if (!cleanUser || !password) {
    return { data: null, error: new Error('Informe o nome de usuário e a senha.') };
  }

  const email = usernameToEmail(cleanUser);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { data: { user: normalizeUser(userCredential.user) }, error: null };
  } catch (err) {
    console.error('Erro no login:', err);
    let message = err.message;
    if (
      err.code === 'auth/invalid-credential' ||
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/wrong-password'
    ) {
      message = 'Usuário ou senha incorretos.';
    }
    return { data: null, error: new Error(message) };
  }
}

/**
 * Encerra a sessão do usuário.
 */
export async function signOut() {
  if (!isFirebaseConfigured || !auth) {
    return { error: null };
  }

  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (err) {
    console.error('Erro ao sair:', err);
    return { error: err };
  }
}

function normalizeUser(user) {
  if (!user) return null;
  if (!user.id && user.uid) {
    Object.defineProperty(user, 'id', {
      value: user.uid,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
  return user;
}

/**
 * Obtém o usuário atual autenticado.
 */
export async function getCurrentUser() {
  if (!isFirebaseConfigured || !auth) {
    return null;
  }
  return normalizeUser(auth.currentUser);
}

/**
 * Extrai o nome de usuário legível do objeto user do Firebase.
 */
export function getDisplayUsername(user) {
  if (!user) return '';
  if (user.displayName) {
    return user.displayName;
  }
  if (user.user_metadata?.username) {
    return user.user_metadata.username;
  }
  if (user.email) {
    return user.email.split('@')[0];
  }
  return 'Usuário';
}

/**
 * Escuta mudanças no estado de autenticação.
 */
export function onAuthStateChange(callback) {
  if (!isFirebaseConfigured || !auth) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', normalizeUser(user));
  });

  return {
    data: {
      subscription: {
        unsubscribe,
      },
    },
  };
}

/**
 * Verifica se o usuário autenticado é o administrador jancanti@gmail.com
 */
export function isAdminUser(user) {
  if (!user) return false;
  const displayName = (user.displayName || '').toLowerCase().trim();
  const username = (user.user_metadata?.username || '').toLowerCase().trim();
  const email = (user.email || '').toLowerCase().trim();
  return (
    email === 'jancanti@gmail.com' ||
    email === 'jancanti@gmail.com@briefing.app' ||
    displayName === 'jancanti@gmail.com' ||
    displayName === 'jancanti' ||
    username === 'jancanti@gmail.com' ||
    username === 'jancanti'
  );
}
