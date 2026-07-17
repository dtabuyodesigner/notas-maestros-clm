import { useState } from 'react'
import { ESPECIALIDADES } from '../lib/corte'
import { enviarNota } from '../lib/datos'

export default function FormularioNota({ onEnviada }) {
  const [especialidad, setEspecialidad] = useState('')
  const [nota, setNota] = useState('')
  const [nombre, setNombre] = useState('')
  const [dni, setDni] = useState('')
  const [consiento, setConsiento] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)

  const notaNum = parseFloat((nota || '').replace(',', '.'))
  const valido = especialidad && !Number.isNaN(notaNum) && notaNum >= 0 && notaNum <= 10 && consiento

  async function enviar(e) {
    e.preventDefault()
    if (!valido) return
    setEnviando(true); setError('')
    const { error } = await enviarNota({ especialidad, nota: notaNum, nombre, dni_parcial: dni })
    setEnviando(false)
    if (error) { setError('No se pudo enviar. Inténtalo de nuevo.'); return }
    setOk(true); setNota(''); setNombre(''); setDni(''); setConsiento(false)
    onEnviada?.()
  }

  if (ok) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
        ✅ ¡Nota añadida! Ya apareces en la tabla.
        <button className="ml-2 underline" onClick={() => setOk(false)}>Añadir otra</button>
      </div>
    )
  }

  return (
    <form onSubmit={enviar} className="bg-white rounded-xl shadow-sm border p-4 space-y-3">
      <select value={especialidad} onChange={e => setEspecialidad(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm">
        <option value="">Elige tu especialidad…</option>
        {ESPECIALIDADES.map(e => <option key={e.nombre} value={e.nombre}>{e.nombre}</option>)}
      </select>
      <input type="text" inputMode="decimal" placeholder="Tu nota (0–10)"
             value={nota} onChange={e => setNota(e.target.value)}
             className="w-full border rounded-lg px-3 py-2 text-sm" />
      <input type="text" placeholder="Nombre o apodo (opcional)" maxLength={60}
             value={nombre} onChange={e => setNombre(e.target.value)}
             className="w-full border rounded-lg px-3 py-2 text-sm" />
      <input type="text" placeholder="DNI parcial (opcional)" maxLength={12}
             value={dni} onChange={e => setDni(e.target.value)}
             className="w-full border rounded-lg px-3 py-2 text-sm" />
      <label className="flex items-start gap-2 text-xs text-gray-600">
        <input type="checkbox" checked={consiento} onChange={e => setConsiento(e.target.checked)} className="mt-0.5" />
        Acepto que mi nota aparezca en la tabla pública (puedo dejarla anónima no rellenando nombre/DNI).
      </label>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button type="submit" disabled={!valido || enviando}
              className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm disabled:opacity-40">
        {enviando ? 'Enviando…' : 'Añadir mi nota'}
      </button>
    </form>
  )
}
