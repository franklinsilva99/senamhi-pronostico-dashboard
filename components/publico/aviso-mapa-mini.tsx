"use client"

type GeoJSONGeometry = {
  type: string
  coordinates: unknown
}

type GeoJSONFeature = {
  type: string
  properties?: Record<string, unknown>
  geometry?: GeoJSONGeometry
}

type GeoJSONCollection = {
  type: string
  features?: GeoJSONFeature[]
}

const NIVEL_COLOR: Record<string, string> = {
  "Nivel 1": "#16a34a",
  "Nivel 2": "#eab308",
  "Nivel 3": "#f97316",
  "Nivel 4": "#dc2626",
}

function swapRing(ring: number[][]): [number, number][] {
  return ring.map(([lng, lat]) => [lat, lng] as [number, number])
}

function rings(geom: GeoJSONGeometry | undefined): [number, number][][] {
  if (!geom) return []
  const c = geom.coordinates as unknown
  if (geom.type === "Polygon") {
    return (c as number[][][]).map(swapRing)
  }
  if (geom.type === "MultiPolygon") {
    return (c as number[][][][]).map((poly) => swapRing(poly[0]))
  }
  return []
}

export function AvisoMapaMini({ geojson }: { geojson: unknown }) {
  const data = geojson as GeoJSONCollection
  const features = data?.features ?? []

  const items: { ring: [number, number][]; color: string }[] = []
  let minLng = Infinity
  let maxLng = -Infinity
  let minLat = Infinity
  let maxLat = -Infinity

  for (const f of features) {
    const nivel = String(f.properties?.nivel ?? "")
    const color = NIVEL_COLOR[nivel] ?? "#64748b"
    for (const ring of rings(f.geometry)) {
      items.push({ ring, color })
      for (const [lat, lng] of ring) {
        if (lng < minLng) minLng = lng
        if (lng > maxLng) maxLng = lng
        if (lat < minLat) minLat = lat
        if (lat > maxLat) maxLat = lat
      }
    }
  }

  if (items.length === 0) {
    return <div className="h-28 w-full rounded bg-muted" />
  }

  const W = 150
  const H = 190
  const pad = 6
  const spanLng = maxLng - minLng || 1
  const spanLat = maxLat - minLat || 1
  const sx = (lng: number) => pad + ((lng - minLng) / spanLng) * (W - pad * 2)
  const sy = (lat: number) => pad + ((maxLat - lat) / spanLat) * (H - pad * 2)

  const pathD = (ring: [number, number][]) =>
    ring
      .map(
        ([lat, lng], i) =>
          `${i === 0 ? "M" : "L"}${sx(lng).toFixed(2)},${sy(lat).toFixed(2)}`
      )
      .join(" ") + " Z"

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block h-auto w-full"
      style={{ background: "#f8fafc" }}
      role="img"
      aria-label="Miniatura del mapa del aviso"
    >
      {items.map((it, i) => (
        <path
          key={i}
          d={pathD(it.ring)}
          fill={it.color}
          fillOpacity={0.7}
          stroke="#ffffff"
          strokeWidth={0.6}
        />
      ))}
    </svg>
  )
}
