// Importa SOLO notas anónimas (especialidad + nota). NUNCA nombres/DNI.
// Uso: node --env-file=.env scripts/importar_semilla.mjs ruta/al/excel.xlsx
//
// Se espera que cada fila del Excel tenga columnas 'especialidad' y 'nota'.
// Si el Excel real usa otros nombres de columna, ajústalos en MAP_COLS.
//
// Usa fetch a la API REST de Supabase (PostgREST) en vez de @supabase/supabase-js
// porque el cliente v2 requiere WebSocket y peta en Node < 22.
import xlsx from 'xlsx'

const [, , ruta] = process.argv
if (!ruta) { console.error('Falta la ruta del Excel'); process.exit(1) }

const URL = process.env.VITE_SUPABASE_URL
const KEY = process.env.VITE_SUPABASE_ANON_KEY
if (!URL || !KEY) { console.error('Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY'); process.exit(1) }

// Ajusta aquí si las columnas del Excel se llaman distinto:
const MAP_COLS = { especialidad: 'especialidad', nota: 'nota' }

const wb = xlsx.readFile(ruta)
const hoja = wb.Sheets[wb.SheetNames[0]]
const filas = xlsx.utils.sheet_to_json(hoja)

const limpias = filas
  .map(f => ({
    especialidad: String(f[MAP_COLS.especialidad] || '').trim(),
    nota: Number(String(f[MAP_COLS.nota]).replace(',', '.')),
  }))
  .filter(f => f.especialidad && !Number.isNaN(f.nota) && f.nota >= 0 && f.nota <= 10)

console.log(`Insertando ${limpias.length} notas anónimas (de ${filas.length} filas)…`)

const res = await fetch(`${URL}/rest/v1/nota_publica`, {
  method: 'POST',
  headers: {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(limpias),
})

if (!res.ok) { console.error('Error:', res.status, await res.text()); process.exit(1) }
console.log('OK')
