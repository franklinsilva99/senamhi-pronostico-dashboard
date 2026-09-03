import provinciasData from "@/lib/data/provincias.json"
import departamentosData from "@/lib/data/departamentos.json"

export interface ProvinciaFeature {
  type: "Feature"
  properties: {
    OBJECTID: number
    ccpp: string
    ccdd: string
    nombprov: string
    nombdep: string
    fuente: string
    [key: string]: unknown
  }
  geometry:
    | { type: "Polygon"; coordinates: number[][][] }
    | { type: "MultiPolygon"; coordinates: number[][][][] }
}

export interface ProvinciaCollection {
  type: "FeatureCollection"
  features: ProvinciaFeature[]
}

export const PROVINCIAS = provinciasData as unknown as ProvinciaCollection

export interface DepartamentoFeature {
  type: "Feature"
  properties: {
    OBJECTID: number
    ccdd: string
    nombdep: string
    fuente: string
    [key: string]: unknown
  }
  geometry:
    | { type: "Polygon"; coordinates: number[][][] }
    | { type: "MultiPolygon"; coordinates: number[][][][] }
}

export interface DepartamentoCollection {
  type: "FeatureCollection"
  features: DepartamentoFeature[]
}

export const DEPARTAMENTOS = departamentosData as unknown as DepartamentoCollection

export function featurePorUbigeo(ubigeo: string): ProvinciaFeature | undefined {
  return PROVINCIAS.features.find((f) => f.properties.ccpp === ubigeo)
}

export function anillosDeFeature(feature: ProvinciaFeature): [number, number][][] {
  if (feature.geometry.type === "Polygon") {
    return feature.geometry.coordinates.map((ring) =>
      ring.map(([lng, lat]) => [lat, lng] as [number, number])
    )
  }

  return feature.geometry.coordinates.map((poligono) =>
    poligono[0].map(([lng, lat]) => [lat, lng] as [number, number])
  )
}

export function anillosDepartamento(
  feature: DepartamentoFeature
): [number, number][][] {
  if (feature.geometry.type === "Polygon") {
    return feature.geometry.coordinates.map((ring) =>
      ring.map(([lng, lat]) => [lat, lng] as [number, number])
    )
  }

  return feature.geometry.coordinates.map((poligono) =>
    poligono[0].map(([lng, lat]) => [lat, lng] as [number, number])
  )
}

function areaAnillo(ring: [number, number][]): number {
  let area = 0
  for (let i = 0; i < ring.length; i++) {
    const [lat1, lng1] = ring[i]
    const [lat2, lng2] = ring[(i + 1) % ring.length]
    area += lng1 * lat2 - lng2 * lat1
  }
  return area / 2
}

function anilloPrincipal(anillos: [number, number][][]): [number, number][] {
  let mejor: [number, number][] = anillos[0]
  let mejorArea = 0
  for (const ring of anillos) {
    const a = Math.abs(areaAnillo(ring))
    if (a > mejorArea) {
      mejorArea = a
      mejor = ring
    }
  }
  return mejor
}

export function puntoEnAnillo(
  lat: number,
  lng: number,
  ring: [number, number][]
): boolean {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [yi, xi] = ring[i]
    const [yj, xj] = ring[j]
    const intersect =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}

function distanciaPuntoSegmento(
  lat: number,
  lng: number,
  a: [number, number],
  b: [number, number]
): number {
  const [ay, ax] = a
  const [by, bx] = b
  const dx = bx - ax
  const dy = by - ay
  const len2 = dx * dx + dy * dy
  if (len2 === 0) return Math.hypot(lng - ax, lat - ay)
  let t = ((lng - ax) * dx + (lat - ay) * dy) / len2
  t = Math.max(0, Math.min(1, t))
  return Math.hypot(lng - (ax + t * dx), lat - (ay + t * dy))
}

export function centroideInterior(
  anillos: [number, number][][]
): [number, number] {
  const ring = anilloPrincipal(anillos)

  let minLat = Infinity
  let maxLat = -Infinity
  let minLng = Infinity
  let maxLng = -Infinity
  for (const [lat, lng] of ring) {
    if (lat < minLat) minLat = lat
    if (lat > maxLat) maxLat = lat
    if (lng < minLng) minLng = lng
    if (lng > maxLng) maxLng = lng
  }

  const pasos = 20
  let mejor: [number, number] | null = null
  let mejorDistancia = -1

  for (let i = 0; i <= pasos; i++) {
    for (let j = 0; j <= pasos; j++) {
      const lat = minLat + ((maxLat - minLat) * i) / pasos
      const lng = minLng + ((maxLng - minLng) * j) / pasos
      if (!puntoEnAnillo(lat, lng, ring)) continue

      let dist = Infinity
      for (let k = 0; k < ring.length; k++) {
        const d = distanciaPuntoSegmento(
          lat,
          lng,
          ring[k],
          ring[(k + 1) % ring.length]
        )
        if (d < dist) dist = d
      }

      if (dist > mejorDistancia) {
        mejorDistancia = dist
        mejor = [lat, lng]
      }
    }
  }

  if (mejor) return mejor

  return [(minLat + maxLat) / 2, (minLng + maxLng) / 2]
}

type BBox = [number, number, number, number]

function bboxDe(ring: [number, number][]): BBox {
  let minLat = Infinity
  let maxLat = -Infinity
  let minLng = Infinity
  let maxLng = -Infinity
  for (const [lat, lng] of ring) {
    if (lat < minLat) minLat = lat
    if (lat > maxLat) maxLat = lat
    if (lng < minLng) minLng = lng
    if (lng > maxLng) maxLng = lng
  }
  return [minLat, maxLat, minLng, maxLng]
}

function bboxesSuperpuestos(a: BBox, b: BBox): boolean {
  return !(a[1] < b[0] || b[1] < a[0] || a[3] < b[2] || b[3] < a[2])
}

function swapRingLngLat(ring: number[][]): [number, number][] {
  return ring.map(([lng, lat]) => [lat, lng] as [number, number])
}

const NIVELES_AFECTADOS = new Set(["Nivel 2", "Nivel 3", "Nivel 4"])

function anillosDeGeojsonAviso(geojson: unknown): [number, number][][] {
  const data = geojson as {
    features?: {
      properties?: { nivel?: unknown }
      geometry?: { type?: string; coordinates?: unknown }
    }[]
  }
  const out: [number, number][][] = []
  for (const f of data?.features ?? []) {
    const nivel = String(f.properties?.nivel ?? "")
    if (!NIVELES_AFECTADOS.has(nivel)) continue
    const g = f.geometry
    if (!g?.coordinates) continue
    if (g.type === "Polygon") {
      for (const ring of g.coordinates as number[][][]) {
        out.push(swapRingLngLat(ring))
      }
    } else if (g.type === "MultiPolygon") {
      for (const poly of g.coordinates as number[][][][]) {
        out.push(swapRingLngLat(poly[0]))
      }
    }
  }
  return out
}

export function departamentosAfectados(geojson: unknown): string[] {
  const anillos = anillosDeGeojsonAviso(geojson)
  if (anillos.length === 0) return []

  const alertas: { ring: [number, number][]; bbox: BBox }[] = anillos.map(
    (ring) => ({ ring, bbox: bboxDe(ring) })
  )

  const nombres: string[] = []

  for (const dep of DEPARTAMENTOS.features) {
    const depAnillos = anillosDepartamento(dep)
    if (depAnillos.length === 0) continue

    const principal = anilloPrincipal(depAnillos)
    const depBBox = bboxDe(principal)
    const centroide = centroideInterior(depAnillos)

    let afectado = false

    for (const alerta of alertas) {
      if (!bboxesSuperpuestos(depBBox, alerta.bbox)) continue

      if (puntoEnAnillo(centroide[0], centroide[1], alerta.ring)) {
        afectado = true
        break
      }

      const paso = Math.max(1, Math.floor(alerta.ring.length / 40))
      for (let k = 0; k < alerta.ring.length; k += paso) {
        const [lat, lng] = alerta.ring[k]
        if (puntoEnAnillo(lat, lng, principal)) {
          afectado = true
          break
        }
      }

      if (afectado) break
    }

    if (afectado) nombres.push(dep.properties.nombdep)
  }

  return nombres.sort()
}
