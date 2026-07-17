// Especialidades y plazas oficiales — Cuerpo de Maestros CLM 2026 (turno libre +
// discapacidad). Fuente: Resolución 20/01/2026 (DOCM 28/01/2026). Ordenadas por
// plazas desc. Si se quisiera usar solo turno libre, cambiar los números.
export const ESPECIALIDADES = [
  { nombre: 'Educación Primaria',           plazas: 180 },
  { nombre: 'Educación Infantil',           plazas: 133 },
  { nombre: 'Lengua Extranjera: Inglés',    plazas: 80 },
  { nombre: 'Pedagogía Terapéutica (PT)',   plazas: 52 },
  { nombre: 'Educación Física',             plazas: 47 },
  { nombre: 'Música',                       plazas: 31 },
  { nombre: 'Audición y Lenguaje (AL)',     plazas: 16 },
  { nombre: 'Lengua Extranjera: Francés',   plazas: 4 },
]

// nº de filas que caen dentro del corte.
export function indiceCorte(total, plazas) {
  return Math.min(total, plazas)
}

// Ordena por nota desc y anota posición (1-based) y si entra (posición <= plazas).
export function ordenarConCorte(notas, plazas) {
  return [...notas]
    .sort((a, b) => b.nota - a.nota)
    .map((fila, i) => ({ fila, posicion: i + 1, entra: i + 1 <= plazas }))
}
