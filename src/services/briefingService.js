import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

/**
 * Gera um ID único amigável (slug de 6 caracteres ou baseado no nome da clínica)
 */
export function generateBriefingId(clinicName = '') {
  const cleanName = clinicName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const randomHash = Math.random().toString(36).substring(2, 8);
  return cleanName ? `${cleanName}-${randomHash}` : `briefing-${randomHash}`;
}

/**
 * Busca o briefing único do usuário no Firestore (o mais recente)
 */
export async function getBriefingForUser(userId) {
  if (!isFirebaseConfigured || !db || !userId) {
    return { data: null, error: new Error('Firebase não configurado ou userId ausente') };
  }

  try {
    const q = query(
      collection(db, 'briefings'),
      where('user_id', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() });
    });

    // Ordena pelo updated_at mais recente em memória
    items.sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));

    return { data: items.length > 0 ? items[0] : null, error: null };
  } catch (err) {
    console.error('Erro ao buscar briefing do usuário:', err);
    return { data: null, error: err };
  }
}

/**
 * Busca um briefing pelo ID no Firestore
 */
export async function getBriefingById(id) {
  if (!isFirebaseConfigured || !db || !id) {
    return { data: null, error: new Error('Firebase não configurado ou ID ausente') };
  }

  try {
    const docRef = doc(db, 'briefings', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { data: null, error: null };
    }

    return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
  } catch (err) {
    console.error('Erro ao buscar briefing:', err);
    return { data: null, error: err };
  }
}

/**
 * Salva ou atualiza um briefing no Firestore (Upsert) vinculado ao usuário
 */
export async function saveBriefingToCloud(id, headerData, answers, userId = null) {
  if (!isFirebaseConfigured || !db) {
    return { data: null, error: new Error('Firebase não configurado') };
  }

  const clinicName = headerData?.clinicName || 'Clínica de Estética';
  const briefingId = id || generateBriefingId(clinicName);

  try {
    const payload = {
      id: briefingId,
      clinic_name: clinicName,
      header_data: headerData || {},
      answers: answers || {},
      updated_at: new Date().toISOString(),
    };

    if (userId) {
      payload.user_id = userId;
    }

    const docRef = doc(db, 'briefings', briefingId);
    await setDoc(docRef, payload, { merge: true });

    return { data: payload, error: null };
  } catch (err) {
    console.error('Erro ao salvar briefing no Firestore:', err);
    return { data: null, error: err };
  }
}

/**
 * Lista todos os briefings salvos pertencentes ao usuário logado (ou todos se admin/sem filtro)
 */
export async function listAllBriefingsFromCloud(userId = null) {
  if (!isFirebaseConfigured || !db) {
    return { data: [], error: new Error('Firebase não configurado') };
  }

  try {
    let q;
    if (userId) {
      q = query(collection(db, 'briefings'), where('user_id', '==', userId));
    } else {
      q = collection(db, 'briefings');
    }

    const querySnapshot = await getDocs(q);
    const list = [];
    querySnapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });

    // Ordena do mais recente para o mais antigo
    list.sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));

    return { data: list, error: null };
  } catch (err) {
    console.error('Erro ao listar briefings:', err);
    return { data: [], error: err };
  }
}

/**
 * Exclui um briefing pelo ID no Firestore
 */
export async function deleteBriefingFromCloud(id) {
  if (!isFirebaseConfigured || !db || !id) {
    return { data: null, error: new Error('Firebase não configurado ou ID ausente') };
  }

  try {
    const docRef = doc(db, 'briefings', id);
    await deleteDoc(docRef);
    return { error: null };
  } catch (err) {
    console.error('Erro ao excluir briefing:', err);
    return { error: err };
  }
}
