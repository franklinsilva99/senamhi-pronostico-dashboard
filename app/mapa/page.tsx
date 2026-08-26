"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MapHeader } from "@/components/map/map-header"
import { MapTabs, type MapTab } from "@/components/map/map-tabs"
import { ForecastMapWrapper } from "@/components/map/forecast-map-wrapper"
import { ForecastChart } from "@/components/map/forecast-chart"
import { ForecastPanel } from "@/components/map/forecast-panel"

export default function MapaPage() {
  const [tab, setTab] = useState<MapTab>("MAPA")

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar active="Mapa" />

      <main className="flex flex-1 flex-col overflow-hidden">
        <MapHeader />

        <div className="grid flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-[1fr_360px]">
          <section
            aria-label={tab === "MAPA" ? "Mapa de pronóstico" : "Gráfico de pronóstico"}
            className="flex min-h-[520px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm"
          >
            <MapTabs active={tab} onChange={setTab} />
            <div className="relative flex-1">
              {tab === "MAPA" ? <ForecastMapWrapper /> : <ForecastChart />}
            </div>
          </section>

          <aside
            aria-label="Detalle de pronóstico"
            className="min-h-[520px] overflow-hidden rounded-xl border border-border bg-card py-3 shadow-sm"
          >
            <ForecastPanel />
          </aside>
        </div>
      </main>
    </div>
  )
}
