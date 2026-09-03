"use client"

import { DEPARTAMENTOS, anillosDepartamento, centroideInterior } from "@/lib/geo"

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

const LEYENDA = [
  { nombre: "Nivel 1 · Verde", color: "#16a34a" },
  { nombre: "Nivel 2 · Amarillo", color: "#eab308" },
  { nombre: "Nivel 3 · Naranja", color: "#f97316" },
  { nombre: "Nivel 4 · Rojo", color: "#dc2626" },
]

const PERU_ANILLOS: [number, number][][] = DEPARTAMENTOS.features.flatMap((f) =>
  anillosDepartamento(f)
)

const DEP_ETIQUETAS: { nombre: string; centroide: [number, number] }[] =
  DEPARTAMENTOS.features.map((f) => ({
    nombre: f.properties.nombdep,
    centroide: centroideInterior(anillosDepartamento(f)),
  }))

function titulo(nombre: string): string {
  return nombre
    .toLowerCase()
    .split(" ")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ")
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

export function AvisoMapaPrint({
  geojson,
  maxHeight = 420,
}: {
  geojson: unknown
  maxHeight?: number
}) {
  const data = geojson as GeoJSONCollection
  const features = data?.features ?? []

  const featureRings: { ring: [number, number][]; color: string }[] = []
  for (const f of features) {
    const nivel = String(f.properties?.nivel ?? "")
    const color = NIVEL_COLOR[nivel] ?? "#64748b"
    for (const ring of rings(f.geometry)) {
      featureRings.push({ ring, color })
    }
  }

  let minLng = Infinity
  let maxLng = -Infinity
  let minLat = Infinity
  let maxLat = -Infinity

  const incluir = (ring: [number, number][]) => {
    for (const [lat, lng] of ring) {
      if (lng < minLng) minLng = lng
      if (lng > maxLng) maxLng = lng
      if (lat < minLat) minLat = lat
      if (lat > maxLat) maxLat = lat
    }
  }

  PERU_ANILLOS.forEach(incluir)
  featureRings.forEach((f) => incluir(f.ring))

  if (!Number.isFinite(minLng)) {
    return <div className="h-40 w-full rounded bg-muted" />
  }

  const pad = 8
  const W = 800
  const spanLng = maxLng - minLng || 1
  const spanLat = maxLat - minLat || 1
  const H = Math.round((W * spanLat) / spanLng)

  const escala = Math.min(1, maxHeight / H)
  const dw = Math.round(W * escala)
  const dh = Math.round(H * escala)
  const k = 1 / escala

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
    <div className="mx-auto inline-block">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={dw}
        height={dh}
        className="block border border-neutral-300"
        style={{ background: "#ffffff" }}
        role="img"
        aria-label="Mapa del aviso"
      >
        {PERU_ANILLOS.map((ring, i) => (
          <path
            key={`pe-${i}`}
            d={pathD(ring)}
            fill="#e2e8f0"
            stroke="#334155"
            strokeWidth={1.2}
          />
        ))}

        {featureRings.map((f, i) => (
          <path
            key={`av-${i}`}
            d={pathD(f.ring)}
            fill={f.color}
            fillOpacity={0.55}
            stroke="#ffffff"
            strokeWidth={1}
          />
        ))}

        {DEP_ETIQUETAS.map((d, i) => (
          <text
            key={`dep-${i}`}
            x={sx(d.centroide[1])}
            y={sy(d.centroide[0])}
            textAnchor="middle"
            fontSize={11 * k}
            fontWeight={600}
            fill="#0f172a"
            stroke="#ffffff"
            strokeWidth={3 * k}
            paintOrder="stroke"
            style={{ fontFamily: "sans-serif" }}
          >
            {titulo(d.nombre)}
          </text>
        ))}
      </svg>

      <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-neutral-700">
        <span className="font-bold uppercase tracking-wide text-neutral-500">
          Nivel de peligrosidad
        </span>
        {LEYENDA.map((l) => (
          <span key={l.nombre} className="inline-flex items-center gap-1">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ background: l.color }}
            />
            {l.nombre}
          </span>
        ))}
      </div>
    </div>
  )
}
