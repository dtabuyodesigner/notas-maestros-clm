# Prompt de handoff para Gemini — proyecto "notas-maestros-clm"

> Copia todo lo de abajo (dentro del bloque) y pégalo a Gemini.

---

Eres un asistente de desarrollo trabajando en la máquina local del usuario (Linux, terminal disponible). Vas a continuar un proyecto ya montado. Lee TODO antes de actuar y respeta las reglas críticas.

## Qué es el proyecto
Una web pública e independiente donde opositores de **Maestros CLM 2026** meten su nota y ven, por especialidad, una tabla ordenada con la línea de corte estimado y un contador. Sustituye a un "Excel de notas" que circulaba por Facebook, pero hecho con datos que la gente mete voluntariamente y con consentimiento.

## Datos del proyecto
- **Carpeta local:** `~/Documentos/notas-maestros-clm/`
- **Repo GitHub:** `git@github.com:dtabuyodesigner/notas-maestros-clm.git` (rama `main`)
- **Desplegado en Vercel:** https://notas-maestros-clm.vercel.app (auto-deploy en cada push a `main`)
- **Almacén:** Supabase (Postgres). Las credenciales están en el fichero local `~/Documentos/notas-maestros-clm/.env` (`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`). La `anon key` es pública por diseño (va en el frontend).
- **Node:** usar el de nvm → `export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"`

## Stack y estructura
- Vite + React 19 + Tailwind 3. Tests con Vitest.
- `src/lib/corte.js` — especialidades + plazas oficiales + cálculo del corte (con tests en `corte.test.js`).
- `src/lib/supabase.js` / `src/lib/datos.js` — cliente y capa de datos (insert/select).
- `src/components/FormularioNota.jsx` — formulario (especialidad, nota, nombre/DNI opcionales, consentimiento).
- `src/components/TablaNotas.jsx` — tabla por especialidad con línea de corte.
- `src/App.jsx` — ensamblado + contador + disclaimer.
- `scripts/importar_semilla.mjs` — importa notas anónimas desde un Excel.

## Tabla en Supabase
`nota_publica(id, especialidad, nota numeric(4,2) 0–10, nombre?, dni_parcial?, created_at)`. RLS: solo INSERT y SELECT permitidos (nunca UPDATE/DELETE desde el cliente). Para borrar filas hay que usar el Table Editor del panel de Supabase.

## Especialidades y plazas (constante, ya en el código)
Educación Primaria 180 · Educación Infantil 133 · Lengua Extranjera: Inglés 80 · Pedagogía Terapéutica (PT) 52 · Educación Física 47 · Música 31 · Audición y Lenguaje (AL) 16 · Lengua Extranjera: Francés 4.

## ⚠️ REGLAS CRÍTICAS (no las rompas)
1. **Al importar el Excel, SOLO se cargan la especialidad y la nota (números). NUNCA nombres ni DNI.** Es la base legal del proyecto: los nombres solo aparecen si cada persona se autoidentifica en la web. Importar nombres de terceros sin su consentimiento está prohibido.
2. La nota debe ser 0–10. Descartar filas sin especialidad válida o sin nota numérica.
3. La `especialidad` del Excel debe coincidir EXACTAMENTE con una de las 8 de arriba (mismo texto). Si en el Excel vienen abreviadas o distintas, mapéalas al nombre exacto antes de insertar (si no, el CHECK de la BD las rechaza).
4. En Node < 22 el cliente `@supabase/supabase-js` peta por WebSocket. Por eso el script de semilla usa `fetch` a la API REST, NO el cliente. Mantén ese enfoque en cualquier script de Node.

## TAREA: cargar la semilla desde el Excel
1. Pídele al usuario la ruta del `.xlsx`/`.csv` y qué columnas son la especialidad y la nota.
2. Abre `scripts/importar_semilla.mjs` y ajusta `MAP_COLS` (nombres de columna reales) y, si hace falta, añade un mapeo de nombres de especialidad al texto exacto de las 8.
3. Ejecuta:
   ```bash
   export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"
   cd ~/Documentos/notas-maestros-clm
   node --env-file=.env scripts/importar_semilla.mjs ~/ruta/al/excel.xlsx
   ```
4. Verifica en https://notas-maestros-clm.vercel.app que aparecen como "Anónimo" en sus especialidades y que la línea de corte cae donde debe.

## Para cambios en la web
Edita el código, prueba en local (`npm run dev` con el `.env`), corre `npm test` y `npm run build`, y haz `git push` a `main` → Vercel redespliega solo. Mantén el estilo actual (indigo + Tailwind) y el disclaimer siempre visible. La web va DESLIGADA de la marca "bolsainterinos" (no la menciones ni enlaces).

---
