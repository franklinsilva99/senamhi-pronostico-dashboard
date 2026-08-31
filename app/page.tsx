"use client"

import { useEffect, useState } from "react"
import { Globe } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { DateRange } from "@/components/date-range"
import { ForecastCalendar } from "@/components/forecast-calendar"
import { RangoBadge } from "@/components/rango-badge"
import { SectorTabs } from "@/components/sector-tabs"
import { ZonesAccordion } from "@/components/zones-accordion"
import { MapHeader } from "@/components/map/map-header"
import { MapTabs, type MapTab } from "@/components/map/map-tabs"
import { ForecastMapWrapper } from "@/components/map/forecast-map-wrapper"
import { ForecastChart } from "@/components/map/forecast-chart"
import { ForecastPanel } from "@/components/map/forecast-panel"
import { useStore } from "@/lib/store"

type Vista = "resumen" | "mapa"

const vistas: { id: Vista; label: string }[] = [
  { id: "resumen", label: "Resumen" },
  { id: "mapa", label: "Mapa" },
]

export default function Page() {
  const [vista, setVista] = useState<Vista>("resumen")
  const [mapTab, setMapTab] = useState<MapTab>("MAPA")
  const { state } = useStore()

  const rondas = state.rondas
    .filter((r) => r.sectorId === state.sectorActivoId)
    .sort((a, b) => a.inicio.localeCompare(b.inicio))

  const [rondaId, setRondaId] = useState(
    () => rondas[rondas.length - 1]?.id ?? ""
  )
  const [zonaFiltro, setZonaFiltro] = useState("todos")

  useEffect(() => {
    setRondaId(rondas[rondas.length - 1]?.id ?? "")
    setZonaFiltro("todos")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.sectorActivoId])

  const editarPronostico = (nuevaRondaId: string, zonaId?: string) => {
    setRondaId(nuevaRondaId)
    setZonaFiltro(zonaId ?? "todos")
    setVista("mapa")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex flex-1 flex-col overflow-x-hidden">
        <header className="flex items-center justify-between border-b border-border bg-card px-8 py-5">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Pronóstico Meteorológico
            </h1>
            <p className="text-sm text-muted-foreground">
              Gestión de sectores, zonas y estados de pronóstico
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/publico"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
              Ver público
            </a>
            <RangoBadge />
          </div>
        </header>

        <nav className="flex items-end gap-1 border-b border-border bg-card px-8">
          {vistas.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVista(v.id)}
              aria-current={vista === v.id ? "page" : undefined}
              className={`-mb-px rounded-t-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                vista === v.id
                  ? "border-border border-b-card bg-background text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {v.label}
            </button>
          ))}
        </nav>

        {vista === "resumen" ? (
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-8">
            <section aria-label="Rango de fechas" className="max-w-xl">
              <DateRange />
            </section>

            <section aria-label="Calendario de pronóstico">
              <ForecastCalendar onEditar={editarPronostico} />
            </section>

            <section aria-label="Sectores">
              <SectorTabs />
            </section>

            <section aria-label="Zonas">
              <ZonesAccordion onEditar={editarPronostico} />
            </section>
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            <MapHeader
              zonaFiltro={zonaFiltro}
              onZonaChange={setZonaFiltro}
              rondaId={rondaId}
              onRondaChange={setRondaId}
            />

            <div className="grid flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <section
                aria-label={
                  mapTab === "MAPA"
                    ? "Mapa de pronóstico"
                    : "Gráfico de pronóstico"
                }
                className="flex min-h-[520px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm"
              >
                <MapTabs active={mapTab} onChange={setMapTab} />
                <div className="relative flex-1 min-h-0">
                  {mapTab === "MAPA" ? (
                    <ForecastMapWrapper
                      rondaId={rondaId}
                      zonaFiltro={zonaFiltro}
                      onZonaChange={setZonaFiltro}
                    />
                  ) : (
                    <ForecastChart zonaFiltro={zonaFiltro} />
                  )}
                </div>
              </section>

              <aside
                aria-label="Detalle de pronóstico"
                className="min-h-[520px] overflow-hidden rounded-xl border border-border bg-card py-3 shadow-sm"
              >
                <ForecastPanel rondaId={rondaId} zonaFiltro={zonaFiltro} />
              </aside>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
