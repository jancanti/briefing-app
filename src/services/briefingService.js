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
 * Salva ou atualiza um briefing no Supabase (Upsert)
 */
export async function saveBriefingToCloud(id, headerData, answers) {
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
 * Lista todos os briefings salvos (para o painel admin)
 */
export async function listAllBriefingsFromCloud() {
  if (!isSupabaseConfigured || !supabase) {
    return { data: [], error: new Error('Supabase não configurado') };
  }

  try {
    const { data, error } = await supabase
      .from('briefings')
      .select('id, clinic_name, updated_at, created_at, header_data, answers')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
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
