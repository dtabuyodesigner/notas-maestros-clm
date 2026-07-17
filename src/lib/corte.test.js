import { describe, it, expect } from 'vitest'
import { ESPECIALIDADES, ordenarConCorte, indiceCorte } from './corte'

describe('ESPECIALIDADES', () => {
  it('tiene las 8 especialidades con plazas correctas', () => {
    const map = Object.fromEntries(ESPECIALIDADES.map(e => [e.nombre, e.plazas]))
    expect(map['Educación Primaria']).toBe(180)
    expect(map['Educación Infantil']).toBe(133)
    expect(map['Lengua Extranjera: Inglés']).toBe(80)
    expect(map['Pedagogía Terapéutica (PT)']).toBe(52)
    expect(map['Educación Física']).toBe(47)
    expect(map['Música']).toBe(31)
    expect(map['Audición y Lenguaje (AL)']).toBe(16)
    expect(map['Lengua Extranjera: Francés']).toBe(4)
    expect(ESPECIALIDADES).toHaveLength(8)
  })
})

describe('ordenarConCorte', () => {
  it('ordena por nota desc y marca quién entra según plazas', () => {
    const notas = [{ nota: 5 }, { nota: 8 }, { nota: 6.5 }]
    const r = ordenarConCorte(notas, 2)
    expect(r.map(x => x.fila.nota)).toEqual([8, 6.5, 5])
    expect(r.map(x => x.posicion)).toEqual([1, 2, 3])
    expect(r.map(x => x.entra)).toEqual([true, true, false])
  })
  it('si hay menos notas que plazas, todas entran', () => {
    const r = ordenarConCorte([{ nota: 7 }], 5)
    expect(r[0].entra).toBe(true)
  })
})

describe('indiceCorte', () => {
  it('es min(total, plazas)', () => {
    expect(indiceCorte(100, 52)).toBe(52)
    expect(indiceCorte(10, 52)).toBe(10)
  })
})
