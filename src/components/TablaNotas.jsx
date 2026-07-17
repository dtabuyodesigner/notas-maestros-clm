import { ESPECIALIDADES, ordenarConCorte } from '../lib/corte'
import { exportarPDF } from '../lib/pdf'

export default function TablaNotas({ notas, especialidad, onEspecialidad }) {
  const meta = ESPECIALIDADES.find(e => e.nombre === especialidad) || ESPECIALIDADES[0]
  const propias = notas.filter(n => n.especialidad === meta.nombre)
  const filas = ordenarConCorte(propias, meta.plazas)

  // Nº de notas por especialidad → punto verde (subida) / rojo (pendiente) + contador.
  const conteos = {}
  notas.forEach(n => { conteos[n.especialidad] = (conteos[n.especialidad] || 0) + 1 })

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-1.5">
        {ESPECIALIDADES.map(e => {
          const n = conteos[e.nombre] || 0
          const activa = e.nombre === meta.nombre
          return (
            <button key={e.nombre} onClick={() => onEspecialidad(e.nombre)}
              className={`text-xs px-2.5 py-1.5 rounded-full border flex items-center gap-1.5 ${activa
                ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${n > 0 ? 'bg-green-500' : 'bg-red-400'}`}></span>
              {e.nombre}
              {n > 0 && <span className="opacity-70">({n})</span>}
            </button>
          )
        })}
      </div>
      <p className="text-[10px] text-gray-400 mb-3">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 align-middle"></span> ya disponible ·
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 align-middle ml-1"></span> pendiente de subir
      </p>

      <div className="flex items-center justify-between mb-2 gap-2">
        <p className="text-xs text-gray-500">
          {propias.length} nota{propias.length === 1 ? '' : 's'} en {meta.nombre} · {meta.plazas} plazas
        </p>
        {filas.length > 0 && (
          <button
            onClick={() => exportarPDF({ especialidad: meta.nombre, plazas: meta.plazas, filas })}
            className="text-xs px-2.5 py-1 rounded-lg border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 flex-shrink-0">
            📄 Descargar PDF
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {filas.length === 0 && <p className="p-4 text-sm text-gray-400">Aún no hay notas en esta especialidad. ¡Sé el primero!</p>}
        {filas.map(({ fila, posicion, entra }, i) => (
          <div key={fila.id ?? i}>
            {posicion === meta.plazas + 1 && (
              <div className="bg-red-50 text-red-700 text-[11px] font-semibold text-center py-1 border-y border-red-200">
                — corte estimado · {meta.plazas} plazas —
              </div>
            )}
            <div className={`flex items-center justify-between px-3 py-2 text-sm border-b last:border-0 ${entra ? '' : 'opacity-60'}`}>
              <span className="flex items-center gap-2">
                <span className="text-gray-400 w-8 tabular-nums">{posicion}</span>
                <span className="text-gray-700">{fila.nombre || fila.dni_parcial || 'Anónimo'}</span>
              </span>
              <span className="font-bold tabular-nums">{Number(fila.nota)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
