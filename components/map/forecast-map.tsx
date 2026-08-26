"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

type WeatherPoint = {
  id: string
  lat: number
  lng: number
  place: string
  min: number
  max: number
  icon: "rain" | "cloud-sun" | "sun-cloud"
}

type NumberPoint = {
  id: string
  lat: number
  lng: number
  value: string
}

const weatherPoints: WeatherPoint[] = [
  { id: "oyon", lat: -10.67, lng: -76.77, place: "OYÓN", min: 6, max: 16, icon: "rain" },
  { id: "yauyos", lat: -12.46, lng: -75.92, place: "YAUYOS", min: 11, max: 25, icon: "cloud-sun" },
  { id: "canete", lat: -13.08, lng: -76.38, place: "CAÑETE", min: 16, max: 25, icon: "sun-cloud" },
]

const numberPoints: NumberPoint[] = [
  { id: "n2", lat: -10.9, lng: -77.6, value: "2" },
  { id: "n8", lat: -11.95, lng: -76.5, value: "8" },
]

const pinPoint = { lat: -11.75, lng: -77.15 }

function weatherIconSvg(icon: WeatherPoint["icon"]) {
  const stroke = "#fff"
  if (icon === "rain") {
    return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 13a5 5 0 0 0-9.6-1.6A3.5 3.5 0 1 0 6 18h9a4 4 0 0 0 1-7.87"/><path d="M8 19v2M12 19v3M16 19v2"/></svg>`
  }
  if (icon === "cloud-sun") {
    return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2M4.9 4.9l1.4 1.4M2 12h2M20 12h2M17.7 6.3l1.4-1.4M12 6a4 4 0 0 1 3.9 3"/><path d="M14 17a4 4 0 0 0-7.7-1.4A3 3 0 1 0 6 21h7a3 3 0 0 0 1-3.9"/></svg>`
  }
  return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="3.2"/><path d="M8 1.5v1.5M8 13v1.5M1.5 8h1.5M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M12.6 3.4l-1 1"/><path d="M20 16a4 4 0 0 0-7.7-1.4A3 3 0 1 0 12 20h7a3 3 0 0 0 1-3.9"/></svg>`
}

function weatherCardHtml(p: WeatherPoint) {
  return `
    <div style="display:flex;flex-direction:column;align-items:center;gap:4px;transform:translateY(-6px)">
      <div style="display:flex;align-items:stretch;border-radius:12px;overflow:hidden;box-shadow:0 6px 16px rgba(15,23,42,.35);border:2px solid #fff">
        <div style="background:#3f4a5a;display:flex;align-items:center;justify-content:center;padding:8px 9px">${weatherIconSvg(p.icon)}</div>
        <div style="background:#5a6577;color:#fff;font:700 14px/1 Inter,sans-serif;display:flex;align-items:center;padding:8px 11px;white-space:nowrap">${p.min}° / ${p.max}°</div>
      </div>
      <span style="background:#3f4a5a;color:#fff;font:700 10px/1 Inter,sans-serif;letter-spacing:.06em;padding:3px 8px;border-radius:5px;box-shadow:0 2px 6px rgba(15,23,42,.3)">${p.place}</span>
    </div>`
}

function numberHtml(n: NumberPoint) {
  return `<div style="width:38px;height:38px;border-radius:9px;background:#3f4a5a;color:#fff;border:2px solid #fff;box-shadow:0 6px 14px rgba(15,23,42,.35);display:flex;align-items:center;justify-content:center;font:700 18px/1 Inter,sans-serif">${n.value}</div>`
}

function pinHtml() {
  return `<div style="transform:translateY(-14px)"><svg width="40" height="52" viewBox="0 0 40 52" fill="none"><path d="M20 2C11.7 2 5 8.7 5 17c0 10.5 15 33 15 33s15-22.5 15-33C35 8.7 28.3 2 20 2Z" fill="#16a34a" stroke="#fff" stroke-width="2.5"/><circle cx="20" cy="17" r="6.5" fill="#fff"/></svg></div>`
}

function FitBounds() {
  const map = useMap()
  useEffect(() => {
    map.setView([-11.9, -76.6], 7)
  }, [map])
  return null
}

export default function ForecastMap() {
  return (
    <MapContainer
      center={[-11.9, -76.6]}
      zoom={7}
      scrollWheelZoom={false}
      className="h-full w-full"
      style={{ background: "#a7cbe3" }}
    >
      <FitBounds />
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {weatherPoints.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={L.divIcon({
            className: "",
            html: weatherCardHtml(p),
            iconSize: [110, 60],
            iconAnchor: [55, 60],
          })}
        />
      ))}

      {numberPoints.map((n) => (
        <Marker
          key={n.id}
          position={[n.lat, n.lng]}
          icon={L.divIcon({
            className: "",
            html: numberHtml(n),
            iconSize: [38, 38],
            iconAnchor: [19, 19],
          })}
        />
      ))}

      <Marker
        position={[pinPoint.lat, pinPoint.lng]}
        icon={L.divIcon({
          className: "",
          html: pinHtml(),
          iconSize: [40, 52],
          iconAnchor: [20, 50],
        })}
      />
    </MapContainer>
  )
}
