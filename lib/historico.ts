import type { MedicionDiaria } from "@/lib/types"
import { addDaysISO } from "@/lib/fechas"
import { HOY } from "@/lib/seed"

const DIAS_HISTORICOS = 30

function hashString(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const cache = new Map<string, MedicionDiaria[]>()

export function historicoDeEstacion(estacionId: string): MedicionDiaria[] {
  const hit = cache.get(estacionId)
  if (hit) return hit

  const rand = mulberry32(hashString(estacionId))

  const serie: MedicionDiaria[] = []
  const inicio = addDaysISO(HOY, -(DIAS_HISTORICOS - 1))

  let baseMax = 24 + rand() * 10
  let baseMin = baseMax - (8 + rand() * 4)
  let tendenciaMax = (rand() - 0.5) * 0.6
  let tendenciaMin = (rand() - 0.5) * 0.6

  for (let i = 0; i < DIAS_HISTORICOS; i++) {
    const fecha = addDaysISO(inicio, i)

    tendenciaMax = tendenciaMax * 0.7 + (rand() - 0.5) * 0.5
    tendenciaMin = tendenciaMin * 0.7 + (rand() - 0.5) * 0.5

    const tMax = Math.round((baseMax + tendenciaMax) * 10) / 10
    const tMin = Math.round((baseMin + tendenciaMin) * 10) / 10

    serie.push({
      fecha,
      tMax: Math.max(tMax, tMin + 1),
      tMin: Math.min(tMin, tMax - 1),
    })

    baseMax += tendenciaMax * 0.6
    baseMin += tendenciaMin * 0.6
  }

  cache.set(estacionId, serie)
  return serie
}

export function ultimos7Dias(serie: MedicionDiaria[]): MedicionDiaria[] {
  return serie.slice(-7)
}
