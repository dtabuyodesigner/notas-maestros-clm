# Notas Oposición · Maestros CLM 2026

Web pública e **independiente** (desligada de la marca bolsainterinos) donde los opositores de **Maestros CLM 2026** meten su nota y ven, por especialidad, una **tabla ordenada** con la **línea de corte estimado** y un **contador de participantes**. Sustituye al "Excel de notas" que circulaba por Facebook, pero con datos que la gente mete voluntariamente y con consentimiento.

- **En producción:** https://notas-maestros-clm.vercel.app
- **Repo:** `git@github.com:dtabuyodesigner/notas-maestros-clm.git` (auto-deploy en cada push a `main`)
- **Diseño/decisiones:** ver el spec en el repo principal → `docs/superpowers/specs/2026-07-17-tabla-notas-publica-design.md`

## Cómo funciona

1. La persona elige **especialidad** y mete su **nota** (fase de oposición / Nota final). Opcionalmente **nombre / DNI parcial**; si no, sale como **"Anónimo"**. Casilla de **consentimiento** obligatoria.
2. La tabla, por especialidad, ordena de mayor a menor y dibuja la **línea de corte** tras la fila Nº = plazas oficiales de esa especialidad.
3. Cada pestaña muestra un **punto verde** (ya hay notas + contador) o **rojo** (pendiente de subir).
4. Botón **"Descargar PDF"** exporta el ranking de la especialidad vista (con la línea de corte).

Todo con **disclaimer** permanente: es una estimación con datos autoinformados (sesgo: quien suspende no se apunta), sin validez oficial.

## Stack

- **Vite + React 19 + Tailwind 3**. Tests con **Vitest**.
- **Supabase** (Postgres gestionado) como almacén. El cliente `@supabase/supabase-js` hace `insert`/`select` directo desde el navegador con la `anon key` + RLS. **Sin backend propio.**
- **jsPDF + jspdf-autotable** para el PDF.
- **@vercel/analytics** para el contador de visitas **privado** (solo visible en el panel de Vercel del dueño; no se muestra nada en la web).

## Estructura

```
src/
  lib/
    corte.js        # ESPECIALIDADES + plazas oficiales + ordenarConCorte / indiceCorte (con tests)
    corte.test.js
    supabase.js     # cliente Supabase (lee VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)
    datos.js        # enviarNota / cargarNotas (paginado) / contarTotal
    pdf.js          # exportarPDF (ranking + línea de corte)
  components/
    FormularioNota.jsx   # form: especialidad, nota, nombre/DNI opcionales, consentimiento
    TablaNotas.jsx       # tabla por especialidad, línea de corte, puntos verde/rojo, botón PDF
  App.jsx           # ensamblado + contador + disclaimer + <Analytics/>
scripts/
  importar_semilla.mjs   # importa notas ANÓNIMAS desde un Excel (solo la columna de nota)
```

## Desarrollo

```bash
export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"   # node vía nvm
# Crear .env a partir de .env.example con las credenciales de Supabase
npm install
npm run dev      # http://localhost:5173
npm test         # tests de la lógica del corte
npm run build
```

`.env` (no se commitea):
```
VITE_SUPABASE_URL=https://<proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon public key>   # pública por diseño (va en el frontend)
```

## Base de datos (Supabase)

Tabla `nota_publica`:
```sql
create table public.nota_publica (
  id bigint generated always as identity primary key,
  especialidad text not null check (especialidad in (... las 8 ...)),
  nota numeric not null,          -- precisión completa (4 decimales del listado oficial)
  nombre text, dni_parcial text,
  created_at timestamptz default now()
);
alter table public.nota_publica enable row level security;
create policy "lectura publica"   on public.nota_publica for select using (true);
create policy "insercion publica" on public.nota_publica for insert with check (true);
```
RLS: solo **INSERT** y **SELECT** (nunca UPDATE/DELETE desde el cliente → para borrar filas, usar el **Table Editor** del panel de Supabase).

> **Precisión:** la columna `nota` es `numeric` (sin escala fija) para guardar los 4 decimales del listado oficial. Con 2 decimales el orden cerca del corte salía mal (empates). Si se recrea la tabla, no la dejes en `numeric(4,2)`.

## Especialidades y plazas (CLM Maestros 2026)

Primaria 180 · Infantil 133 · Inglés 80 · PT 52 · Educación Física 47 · Música 31 · AL 16 · Francés 4. (Constante en `src/lib/corte.js`. Fuente: Resolución 20/01/2026, DOCM 28/01/2026.)

## Cargar semilla desde un fichero (PDF/XLSX/CSV)

**REGLA CRÍTICA:** de cualquier fichero se importa **solo la especialidad + la Nota final (números). NUNCA nombres ni DNI.** Los nombres solo aparecen si la persona se autoidentifica en la web.

- **CSV** con una columna de nota → `node --env-file=.env scripts/importar_semilla.mjs <fichero>` (ajusta `MAP_COLS` si las columnas se llaman distinto).
- **XLSX/PDF** con otra estructura → parsear a mano la columna "Nota final" e insertar vía la API REST de Supabase con `fetch` (⚠️ el cliente `@supabase/supabase-js` peta en Node < 22 por WebSocket; en scripts de Node usar `fetch`).

**Gotcha de lectura:** PostgREST limita cada `select` a **1000 filas**. `cargarNotas()` **pagina** con `.range()` para traerlas todas; cualquier consulta directa debe paginar igual.

### Datos ya cargados (2026-07-17)
Inglés **332** · Primaria **967** · Infantil **664** (todas anónimas, Nota final). Cortes estimados: Inglés 6,8104 · Primaria 8,0424 · Infantil 7,9307. Pendientes: Música, EF, PT, AL, Francés.

## Contador de visitas (privado)

Vercel Web Analytics (`<Analytics/>` en `App.jsx`). Se ve **solo** en Vercel → proyecto → **Analytics** (cuenta del dueño). No aparece nada en la web pública. Requiere activarlo una vez en el panel de Vercel. Nota: los bloqueadores (p.ej. Brave Shields) impiden que TU propia visita cuente; los visitantes normales sí.

## Deploy

`git push` a `main` → Vercel redespliega solo. Variables de entorno (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) configuradas en Vercel → Settings → Environment Variables.
