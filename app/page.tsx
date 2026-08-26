import { AppSidebar } from "@/components/app-sidebar"
import { DateRange } from "@/components/date-range"
import { ForecastCalendar } from "@/components/forecast-calendar"
import { SectorTabs } from "@/components/sector-tabs"
import { ZonesAccordion } from "@/components/zones-accordion"

export default function Page() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 overflow-x-hidden">
        <header className="flex items-center justify-between border-b border-border bg-card px-8 py-5">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Pronóstico Meteorológico
            </h1>
            <p className="text-sm text-muted-foreground">
              Gestión de sectores, zonas y estados de pronóstico
            </p>
          </div>
          <span className="rounded-full bg-forecast/15 px-3 py-1 text-xs font-semibold text-forecast-foreground">
            Semana activa · 22–28 Ago 2026
          </span>
        </header>

        <div className="mx-auto flex max-w-5xl flex-col gap-6 p-8">
          <section aria-label="Rango de fechas" className="max-w-xl">
            <DateRange />
          </section>

          <section aria-label="Calendario de pronóstico">
            <ForecastCalendar />
          </section>

          <section aria-label="Sectores">
            <SectorTabs />
          </section>

          <section aria-label="Zonas">
            <ZonesAccordion />
          </section>
        </div>
      </main>
    </div>
  )
}
