"use client"

import "leaflet/dist/leaflet.css"

import { useEffect } from "react"
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Polygon,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet"
import { useStore } from "@/lib/store"
import { anillosDeFeature, featurePorUbigeo } from "@/lib/geo"
import { EstacionPopupChart } from "./estacion-popup-chart"
import type { Zona } from "@/lib/types"

const STATUS_COLORS = {
  forecast: { stroke: "#15803d", fill: "#22c55e" },
  process: { stroke: "#c2410c", fill: "#f97316" },
  noforecast: { stroke: "#1d4ed8", fill: "#60a5fa" },
}

type ZonaMapa = { zona: Zona; anillos: [number, number][][] }

function MapController({
  sectorId,
  zonasMapa,
}: {
  sectorId: string
  zonasMapa: ZonaMapa[]
}) {
  const map = useMap()

  useEffect(() => {
    const pts = zonasMapa.flatMap((z) => z.anillos).flat()

    const ajustar = () => {
      map.invalidateSize()
      if (pts.length > 1) {
        map.fitBounds(pts, { padding: [16, 16], maxZoom: 11 })
      }
    }

    const timer = setTimeout(ajustar, 100)

    const container = map.getContainer()
    const observer = new ResizeObserver(() => map.invalidateSize())
    if (container) observer.observe(container)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectorId, map])

  return null
}

export default function ForecastMap({
  rondaId,
  zonaFiltro,
  onZonaChange,
}: {
  rondaId: string
  zonaFiltro: string
  onZonaChange: (id: string) => void
}) {
  const { state } = useStore()

  const zonas = state.zonas.filter((z) => z.sectorId === state.sectorActivoId)
  const ronda = state.rondas.find((r) => r.id === rondaId)

  const zonasMapa: ZonaMapa[] = []
  for (const z of zonas) {
    if (!z.ubigeo) continue
    const feat = featurePorUbigeo(z.ubigeo)
    if (!feat) continue
    zonasMapa.push({ zona: z, anillos: anillosDeFeature(feat) })
  }

  const zonaIds = new Set(zonas.map((z) => z.id))
  const estaciones = state.estaciones.filter((e) => zonaIds.has(e.zonaId))

  const estilo = (zonaId: string) => {
    const tiene = ronda
      ? state.pronosticos.some(
          (p) => p.zonaId === zonaId && p.rondaId === ronda.id
        )
      : false
    const status = !ronda ? "noforecast" : tiene ? "forecast" : "process"
    const c = STATUS_COLORS[status]
    const selected = zonaFiltro === zonaId
    return {
      color: selected ? "#0f172a" : c.stroke,
      weight: selected ? 3.5 : 2,
      fillColor: c.fill,
      fillOpacity: selected ? 0.45 : 0.18,
    }
  }

  return (
    <MapContainer
      center={[-6.5, -76.5]}
      zoom={6}
      scrollWheelZoom={false}
      className="absolute inset-0"
      style={{ background: "#a7cbe3" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController sectorId={state.sectorActivoId} zonasMapa={zonasMapa} />

      {zonasMapa.map(({ zona, anillos }) => (
        <Polygon
          key={zona.id}
          positions={anillos}
          pathOptions={estilo(zona.id)}
          eventHandlers={{ click: () => onZonaChange(zona.id) }}
        >
          <Tooltip sticky>{zona.nombre}</Tooltip>
        </Polygon>
      ))}

      {estaciones.map((e) => (
        <CircleMarker
          key={e.id}
          center={[e.lat, e.lng]}
          radius={5}
          pathOptions={{
            color: "#ffffff",
            weight: 1.5,
            fillColor: "#1f2937",
            fillOpacity: 1,
          }}
        >
          <Tooltip>{e.nombre}</Tooltip>
          <Popup>
            <EstacionPopupChart estacion={e} />
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
