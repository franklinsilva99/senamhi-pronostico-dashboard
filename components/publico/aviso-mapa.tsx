"use client"

import "leaflet/dist/leaflet.css"

import { useEffect, useState } from "react"
import {
  MapContainer,
  TileLayer,
  Polygon,
  Tooltip,
  useMap,
} from "react-leaflet"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DEPARTAMENTOS, anillosDepartamento } from "@/lib/geo"
import { fmtFechaCompleta } from "@/lib/fechas"
import type { Aviso } from "@/lib/types"

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
  "Nivel 2": "#fbfb05",
  "Nivel 3": "#fb743c",
  "Nivel 4": "#fb0505",
}

const NIVELES = [
  {
    id: "nivel-2",
    nombre: "Amarillo",
    color: "#fbfb05",
    texto: "#000000",
    peligro:
      "Pueden ocurrir fenómenos meteorológicos peligrosos que, sin embargo, son normales en esta región.",
    recomendacion:
      "Manténgase al corriente del desarrollo de la situación meteorológica. Sea prudente si realiza actividades al aire libre que puedan acarrear riesgos en caso de mal tiempo.",
  },
  {
    id: "nivel-3",
    nombre: "Naranja",
    color: "#fb743c",
    texto: "#ffffff",
    peligro: "Se predicen fenómenos meteorológicos peligrosos.",
    recomendacion:
      "Manténgase al corriente del desarrollo de la situación y cumpla los consejos e instrucciones dados por las autoridades.",
  },
  {
    id: "nivel-4",
    nombre: "Rojo",
    color: "#fb0505",
    texto: "#ffffff",
    peligro: "Se predicen fenómenos meteorológicos de gran magnitud.",
    recomendacion:
      "Sea extremadamente precavido. Esté al corriente en todo momento del desarrollo de la situación y cumpla los consejos e instrucciones dados por las autoridades.",
  },
] as const

type NivelId = (typeof NIVELES)[number]["id"]

const NIVEL_POR_AVISO: Record<string, NivelId> = {
  AMARILLO: "nivel-2",
  NARANJA: "nivel-3",
  ROJO: "nivel-4",
}

function horaDe(iso: string): string {
  if (!iso) return "—"
  const [fecha, hora] = iso.split("T")
  void fecha
  return (hora ?? "").slice(0, 5) || "—"
}

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

export default function AvisoMapa({
  geojson,
  aviso,
  fecha,
}: {
  geojson: unknown
  aviso?: Aviso
  fecha?: string
}) {
  const data = geojson as GeoJSONCollection
  const features = data?.features ?? []

  const [abierto, setAbierto] = useState(true)
  const [nivelActivo, setNivelActivo] = useState<NivelId>(
    () => NIVEL_POR_AVISO[aviso?.nivel ?? ""] ?? "nivel-2"
  )

  const nivelInfo =
    NIVELES.find((n) => n.id === nivelActivo) ?? NIVELES[NIVELES.length - 1]

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

      <div className="absolute bottom-3 left-3 z-[500] max-h-[calc(100%-24px)] overflow-y-auto">
        {!abierto && (
          <button
            type="button"
            onClick={() => setAbierto(true)}
            aria-label="Mostrar detalle del aviso"
            className="flex h-8 w-8 items-center justify-center rounded-md bg-black/60 text-white shadow-sm"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        )}

        {abierto && (
          <div className="relative w-[260px] rounded-lg bg-black/60 px-3 py-2 text-white shadow-sm">
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Ocultar detalle del aviso"
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded text-white/70 hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>

            <p className="text-[10px] font-bold uppercase tracking-wide text-white/80">
              Fecha
            </p>
            <p className="text-[11px] text-cyan-300">{fmtFechaCompleta(fecha ?? "")}</p>

            <hr className="my-2 border-t border-white/30" />

            <div className="text-[11px]">
              <span className="text-white/70">Hora de inicio: </span>
              <span className="text-red-400">
                {aviso ? horaDe(aviso.inicio_evento) : "—"} (hora local)
              </span>
            </div>
            <div className="text-[11px]">
              <span className="text-white/70">Hora de fin: </span>
              <span className="text-red-400">
                {aviso ? horaDe(aviso.fin_evento) : "—"} (hora local)
              </span>
            </div>

            <hr className="my-2 border-t border-white/30" />

            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-red-400">
              Niveles de peligro
            </p>
            <div className="flex gap-1">
              {NIVELES.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setNivelActivo(n.id)}
                  className={`flex-1 rounded px-1 py-0.5 text-[10px] font-bold ${
                    nivelActivo === n.id ? "ring-1 ring-white" : "opacity-70"
                  }`}
                  style={{ background: n.color, color: n.texto }}
                >
                  {n.nombre}
                </button>
              ))}
            </div>

            <div className="mt-1.5 text-[10px] leading-snug">
              <p>
                <strong className="text-red-400">Peligro:</strong>{" "}
                {nivelInfo.peligro}
              </p>
              <p className="mt-1">
                <strong className="text-red-400">Recomendación:</strong>{" "}
                {nivelInfo.recomendacion}
              </p>
            </div>

            <hr className="my-2 border-t border-white/30" />

            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-cyan-300">
              Departamentos de posible afectación
            </p>
            <p className="text-[10px] leading-snug text-white/90">
              {aviso?.departamentos || "—"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
