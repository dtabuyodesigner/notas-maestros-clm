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
  // PostgREST limita cada SELECT a 1000 filas → paginamos con .range() hasta
  // traerlas todas (con miles de notas, una sola petición se quedaba corta y
  // faltaban especialidades enteras).
  const PAGE = 1000
  let desde = 0
  let todas = []
  for (;;) {
    const { data, error } = await supabase
      .from('nota_publica')
      .select('id, especialidad, nota, nombre, dni_parcial')
      .order('id', { ascending: true })
      .range(desde, desde + PAGE - 1)
    if (error) throw error
    todas = todas.concat(data || [])
    if (!data || data.length < PAGE) break
    desde += PAGE
  }
  return todas
}

export async function contarTotal() {
  const { count, error } = await supabase
    .from('nota_publica')
    .select('id', { count: 'exact', head: true })
  if (error) throw error
  return count || 0
}
