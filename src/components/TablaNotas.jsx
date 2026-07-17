import { ESPECIALIDADES, ordenarConCorte } from '../lib/corte'

export default function TablaNotas({ notas, especialidad, onEspecialidad }) {
  const meta = ESPECIALIDADES.find(e => e.nombre === especialidad) || ESPECIALIDADES[0]
  const propias = notas.filter(n => n.especialidad === meta.nombre)
  const filas = ordenarConCorte(propias, meta.plazas)

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {ESPECIALIDADES.map(e => (
          <button key={e.nombre} onClick={() => onEspecialidad(e.nombre)}
            className={`text-xs px-2.5 py-1.5 rounded-full border ${e.nombre === meta.nombre
              ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600'}`}>
            {e.nombre}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 mb-2">
        {propias.length} nota{propias.length === 1 ? '' : 's'} en {meta.nombre} · {meta.plazas} plazas
      </p>

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
              <span className="font-bold tabular-nums">{Number(fila.nota).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
