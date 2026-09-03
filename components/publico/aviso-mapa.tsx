"use client"

import "leaflet/dist/leaflet.css"

import { useEffect } from "react"
import {
  MapContainer,
  TileLayer,
  Polygon,
  Tooltip,
  useMap,
} from "react-leaflet"
import { DEPARTAMENTOS, anillosDepartamento } from "@/lib/geo"

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

function FitPeru() {
  const map = useMap()

  useEffect(() => {
    const pts: [number, number][] = []
    for (const ring of PERU_ANILLOS) {
      for (const p of ring) pts.push(p)
    }
    if (pts.length > 0) {
      map.fitBounds(pts, { padding: [12, 12] })
    }
  }, [map])

  return null
}

export default function AvisoMapa({ geojson }: { geojson: unknown }) {
  const data = geojson as GeoJSONCollection
  const features = data?.features ?? []

  return (
    <div className="relative mx-auto aspect-[2/3] w-full max-w-4xl overflow-hidden rounded border border-border">
      <MapContainer
        center={[-10, -75]}
        zoom={5}
        scrollWheelZoom={false}
        className="absolute inset-0"
        style={{ background: "#a7cbe3" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitPeru />

        {PERU_ANILLOS.map((ring, i) => (
          <Polygon
            key={`pe-${i}`}
            positions={ring}
            pathOptions={{
              color: "#334155",
              weight: 1.5,
              fillColor: "#e2e8f0",
              fillOpacity: 0.1,
            }}
          />
        ))}

        {features.map((f, i) => {
          const nivel = String(f.properties?.nivel ?? "")
          const color = NIVEL_COLOR[nivel] ?? "#64748b"
          return rings(f.geometry).map((ring, j) => (
            <Polygon
              key={`av-${i}-${j}`}
              positions={ring}
              pathOptions={{
                color: "#ffffff",
                weight: 1.5,
                fillColor: color,
                fillOpacity: 0.3,
              }}
            >
              <Tooltip sticky>{nivel || "Área alertada"}</Tooltip>
            </Polygon>
          ))
        })}
      </MapContainer>

      <div className="pointer-events-none absolute bottom-3 right-3 z-[500] rounded-lg border border-border bg-card/95 px-3 py-2 shadow-sm">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          Nivel de peligrosidad
        </p>
        {LEYENDA.map((n) => (
          <div key={n.nombre} className="flex items-center gap-2 py-0.5 text-[11px]">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ background: n.color }}
            />
            <span className="text-foreground">{n.nombre}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
