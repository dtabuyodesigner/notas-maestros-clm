import { supabase } from './supabase'

export async function enviarNota({ especialidad, nota, nombre, dni_parcial }) {
  return supabase.from('nota_publica').insert({
    especialidad,
    nota,
    nombre: nombre?.trim() || null,
    dni_parcial: dni_parcial?.trim() || null,
  })
}

export async function cargarNotas() {
  const { data, error } = await supabase
    .from('nota_publica')
    .select('id, especialidad, nota, nombre, dni_parcial')
  if (error) throw error
  return data || []
}

export async function contarTotal() {
  const { count, error } = await supabase
    .from('nota_publica')
    .select('id', { count: 'exact', head: true })
  if (error) throw error
  return count || 0
}
