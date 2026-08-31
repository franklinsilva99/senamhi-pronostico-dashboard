"use client"

import "leaflet/dist/leaflet.css"

import { useEffect } from "react"
import {
  MapContainer,
  Marker,
  TileLayer,
  Polygon,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet"
import { divIcon } from "leaflet"
import { useStore } from "@/lib/store"
import { anillosDeFeature, featurePorUbigeo } from "@/lib/geo"
import { iconoSrc } from "@/lib/iconos"
import { entre, fmtCortoConDia, fmtRangoConAnio } from "@/lib/fechas"
import { HOY } from "@/lib/seed"
import type { DiaPronostico, Pronostico, Ronda, Zona } from "@/lib/types"

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

function puntoEnAnillo(
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

function centroideInterior(anillos: [number, number][][]): [number, number] {
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

function markerIcon(icono: string | undefined, tMax: number, tMin: number) {
  const src = iconoSrc(icono || "icon003")
  const html = `
    <div style="display:flex;align-items:center;gap:4px;white-space:nowrap;padding:3px 9px;background:rgba(255,255,255,0.92);border:1px solid #cbd5e1;border-radius:999px;box-shadow:0 1px 4px rgba(0,0,0,0.25);">
      <img src="${src}" alt="" style="width:20px;height:20px;object-fit:contain;"/>
      <span style="font-family:monospace;font-size:12px;font-weight:700;color:#dc2626;">${tMax}°</span>
      <span style="color:#94a3b8;">/</span>
      <span style="font-family:monospace;font-size:12px;font-weight:700;color:#2563eb;">${tMin}°</span>
    </div>`
  return divIcon({
    html,
    className: "",
    iconSize: [90, 30],
    iconAnchor: [45, 30],
    popupAnchor: [0, -30],
  })
}

function PopupPronostico({
  zona,
  pronostico,
}: {
  zona: Zona
  pronostico: Pronostico
}) {
  const rango = fmtRangoConAnio(pronostico.inicio, pronostico.fin)

  return (
    <div style={{ minWidth: 320, fontFamily: "sans-serif", fontSize: 12 }}>
      <div
        style={{
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: 6,
          marginBottom: 8,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
          {zona.nombre}
        </div>
        <div style={{ color: "#64748b", fontSize: 11 }}>
          Pronóstico · {rango}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "3px 0",
          color: "#94a3b8",
          fontSize: 10,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 0.3,
        }}
      >
        <span style={{ width: 76 }}>Fecha</span>
        <span style={{ width: 22 }} />
        <span style={{ width: 36, textAlign: "right" }}>Máx</span>
        <span style={{ width: 36, textAlign: "right" }}>Mín</span>
      </div>

      {pronostico.dias.map((d: DiaPronostico) => (
        <div
          key={d.fecha}
          style={{ padding: "6px 0", borderTop: "1px solid #f1f5f9" }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ width: 76, color: "#475569", fontWeight: 600 }}>
              {fmtCortoConDia(d.fecha)}
            </span>
            <span
              style={{
                width: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {d.icono ? (
                <img
                  src={iconoSrc(d.icono)}
                  alt=""
                  style={{ width: 20, height: 20, objectFit: "contain" }}
                />
              ) : null}
            </span>
            <span
              style={{
                width: 36,
                textAlign: "right",
                color: "#dc2626",
                fontWeight: 700,
              }}
            >
              {d.tMax}°
            </span>
            <span
              style={{
                width: 36,
                textAlign: "right",
                color: "#2563eb",
                fontWeight: 700,
              }}
            >
              {d.tMin}°
            </span>
          </div>
          <div
            style={{
              marginTop: 2,
              paddingLeft: 106,
              color: "#94a3b8",
              fontSize: 11,
              lineHeight: 1.4,
            }}
          >
            {d.descripcion || "—"}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function MapaPublico() {
  const { state } = useStore()

  const publishedIds = new Set(
    state.rondas.filter((r) => r.estado === "Publicado").map((r) => r.id)
  )

  const zonas = state.zonas

  const pronosticoZona = (
    zonaId: string
  ): { pronostico: Pronostico; ronda: Ronda } | null => {
    const candidatos = state.pronosticos
      .filter((p) => p.zonaId === zonaId && publishedIds.has(p.rondaId))
      .map((p) => ({ p, ronda: state.rondas.find((r) => r.id === p.rondaId) }))
      .filter(
        (x): x is { p: Pronostico; ronda: Ronda } => x.ronda !== undefined
      )

    if (candidatos.length === 0) return null

    const cubreHoy = candidatos.find((c) =>
      entre(HOY, c.ronda.inicio, c.ronda.fin)
    )
    const elegido =
      cubreHoy ??
      candidatos.sort((a, b) => b.ronda.inicio.localeCompare(a.ronda.inicio))[0]

    return { pronostico: elegido.p, ronda: elegido.ronda }
  }

  const diaReferencia = (pronostico: Pronostico): DiaPronostico | undefined =>
    pronostico.dias.find((d) => d.fecha === HOY) ?? pronostico.dias[0]

  const zonasMapa: ZonaMapa[] = []
  for (const z of zonas) {
    if (!z.ubigeo) continue
    const feat = featurePorUbigeo(z.ubigeo)
    if (!feat) continue
    zonasMapa.push({ zona: z, anillos: anillosDeFeature(feat) })
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

      {zonasMapa.map(({ zona, anillos }) => {
        const res = pronosticoZona(zona.id)
        const tiene = res !== null
        const fillColor = tiene ? "#22c55e" : "#e2e8f0"
        const color = tiene ? "#15803d" : "#94a3b8"
        const ref = res ? diaReferencia(res.pronostico) : undefined

        return (
          <Polygon
            key={zona.id}
            positions={anillos}
            pathOptions={{
              color,
              weight: 2,
              fillColor,
              fillOpacity: tiene ? 0.35 : 0.15,
            }}
          >
            <Tooltip sticky>{zona.nombre}</Tooltip>
            {res && (
              <>
                <Popup>
                  <PopupPronostico zona={zona} pronostico={res.pronostico} />
                </Popup>
                <Marker
                  position={centroideInterior(anillos)}
                  icon={
                    ref
                      ? markerIcon(ref.icono, ref.tMax, ref.tMin)
                      : markerIcon(undefined, 0, 0)
                  }
                >
                  <Popup>
                    <PopupPronostico zona={zona} pronostico={res.pronostico} />
                  </Popup>
                </Marker>
              </>
            )}
          </Polygon>
        )
      })}
    </MapContainer>
  )
}
