import { supabase, isSupabaseConfigured } from '../lib/supabase';

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
 * Busca o briefing único do usuário no Supabase (o mais recente)
 */
export async function getBriefingForUser(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) {
    return { data: null, error: new Error('Supabase não configurado ou userId ausente') };
  }

  try {
    const { data, error } = await supabase
      .from('briefings')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    return { data: data && data.length > 0 ? data[0] : null, error: null };
  } catch (err) {
    console.error('Erro ao buscar briefing do usuário:', err);
    return { data: null, error: err };
  }
}

/**
 * Busca um briefing pelo ID no Supabase
 */
export async function getBriefingById(id) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: new Error('Supabase não configurado') };
  }

  try {
    const { data, error } = await supabase
      .from('briefings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Erro ao buscar briefing:', err);
    return { data: null, error: err };
  }
}

/**
 * Salva ou atualiza um briefing no Supabase (Upsert) vinculado ao usuário
 */
export async function saveBriefingToCloud(id, headerData, answers, userId = null) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: new Error('Supabase não configurado') };
  }

  const clinicName = headerData?.clinicName || 'Clínica de Estética';

  try {
    const payload = {
      id,
      clinic_name: clinicName,
      header_data: headerData,
      answers: answers,
      updated_at: new Date().toISOString(),
    };

    if (userId) {
      payload.user_id = userId;
    }

    const { data, error } = await supabase
      .from('briefings')
      .upsert(payload)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Erro ao salvar briefing na nuvem:', err);
    return { data: null, error: err };
  }
}

/**
 * Lista todos os briefings salvos pertencentes ao usuário logado
 */
export async function listAllBriefingsFromCloud(userId = null) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: [], error: new Error('Supabase não configurado') };
  }

  try {
    let query = supabase
      .from('briefings')
      .select('id, clinic_name, updated_at, created_at, header_data, answers, user_id')
      .order('updated_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err) {
    console.error('Erro ao listar briefings:', err);
    return { data: [], error: err };
  }
}

/**
 * Exclui um briefing pelo ID
 */
export async function deleteBriefingFromCloud(id) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: new Error('Supabase não configurado') };
  }

  try {
    const { error } = await supabase
      .from('briefings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (err) {
    console.error('Erro ao excluir briefing:', err);
    return { error: err };
  }
}
