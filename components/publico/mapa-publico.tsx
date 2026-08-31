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
import { useStore } from "@/lib/store"
import { anillosDeFeature, featurePorUbigeo } from "@/lib/geo"
import type { Zona } from "@/lib/types"

type ZonaMapa = { zona: Zona; anillos: [number, number][][] }

function FitBounds({ zonasMapa }: { zonasMapa: ZonaMapa[] }) {
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
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  return null
}

export default function MapaPublico({ rondaId }: { rondaId: string }) {
  const { state } = useStore()

  const ronda = state.rondas.find((r) => r.id === rondaId)
  const zonas = state.zonas.filter((z) => z.sectorId === ronda?.sectorId)

  const zonasMapa: ZonaMapa[] = []
  for (const z of zonas) {
    if (!z.ubigeo) continue
    const feat = featurePorUbigeo(z.ubigeo)
    if (!feat) continue
    zonasMapa.push({ zona: z, anillos: anillosDeFeature(feat) })
  }

  const estilo = (zonaId: string) => {
    const tiene = ronda
      ? state.pronosticos.some(
          (p) => p.zonaId === zonaId && p.rondaId === ronda.id
        )
      : false
    return {
      color: tiene ? "#15803d" : "#94a3b8",
      weight: 2,
      fillColor: tiene ? "#22c55e" : "#e2e8f0",
      fillOpacity: tiene ? 0.35 : 0.15,
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
      <FitBounds zonasMapa={zonasMapa} />
      {zonasMapa.map(({ zona, anillos }) => (
        <Polygon key={zona.id} positions={anillos} pathOptions={estilo(zona.id)}>
          <Tooltip sticky>{zona.nombre}</Tooltip>
        </Polygon>
      ))}
    </MapContainer>
  )
}
