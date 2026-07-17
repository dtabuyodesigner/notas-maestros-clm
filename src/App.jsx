import { useEffect, useState, useCallback } from 'react'
import { ESPECIALIDADES } from './lib/corte'
import { cargarNotas } from './lib/datos'
import FormularioNota from './components/FormularioNota'
import TablaNotas from './components/TablaNotas'

export default function App() {
  const [notas, setNotas] = useState([])
  const [especialidad, setEspecialidad] = useState(null)  // null = auto (la más poblada)

  const refrescar = useCallback(() => { cargarNotas().then(setNotas).catch(() => {}) }, [])
  useEffect(() => { refrescar() }, [refrescar])

  // Default automático: abrir por la especialidad con más notas (hasta que el
  // usuario elija una a mano). Así la web nunca arranca en una pestaña vacía.
  useEffect(() => {
    if (especialidad || notas.length === 0) return
    const conteo = {}
    notas.forEach(n => { conteo[n.especialidad] = (conteo[n.especialidad] || 0) + 1 })
    const top = ESPECIALIDADES.map(e => e.nombre)
      .sort((a, b) => (conteo[b] || 0) - (conteo[a] || 0))[0]
    setEspecialidad(top)
  }, [notas, especialidad])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white px-4 py-4 text-center">
        <h1 className="text-lg font-bold">Notas Oposición · Maestros CLM 2026</h1>
        <p className="text-xs opacity-80 mt-0.5">{notas.length} personas se han apuntado</p>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800 leading-relaxed">
          ⚠️ <strong>Orientativo.</strong> Datos que mete la gente voluntariamente, no oficiales. El corte es una
          <strong> estimación</strong> con sesgo (quien suspende no suele apuntarse). El corte real lo fija la Administración.
        </div>

        <FormularioNota onEnviada={refrescar} />
        <TablaNotas notas={notas} especialidad={especialidad} onEspecialidad={setEspecialidad} />

        <p className="text-center text-[10px] text-gray-400 pt-4">
          Herramienta comunitaria independiente · sin validez oficial
        </p>
      </main>
    </div>
  )
}
