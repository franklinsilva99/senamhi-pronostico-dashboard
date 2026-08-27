"use client"

import { useStore } from "@/lib/store"

export function SectorTabs() {
  const { state, seleccionarSector } = useStore()
  const zonasActivas = state.zonas.filter(
    (z) => z.sectorId === state.sectorActivoId
  )

  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      {state.sectores.map((s) => {
        const active = state.sectorActivoId === s.id
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => seleccionarSector(s.id)}
            aria-pressed={active}
            className={`shrink-0 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
              active
                ? "bg-forecast text-forecast-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {s.nombre}
          </button>
        )
      })}
      <span className="ml-1 shrink-0 whitespace-nowrap text-xs italic text-muted-foreground">
        ({zonasActivas.length} zonas)
      </span>
    </div>
  )
}
