"use client"

import type { ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import { useStore } from "@/lib/store"
import { fmtRangoConAnio } from "@/lib/fechas"

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  children: ReactNode
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none rounded-lg border border-input bg-card py-1.5 pl-3 pr-8 text-sm text-foreground shadow-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </label>
  )
}

export function MapHeader({
  zonaFiltro,
  onZonaChange,
  rondaId,
  onRondaChange,
}: {
  zonaFiltro: string
  onZonaChange: (value: string) => void
  rondaId: string
  onRondaChange: (value: string) => void
}) {
  const { state, seleccionarSector } = useStore()

  const zonas = state.zonas.filter((z) => z.sectorId === state.sectorActivoId)
  const rondas = state.rondas
    .filter((r) => r.sectorId === state.sectorActivoId)
    .sort((a, b) => a.inicio.localeCompare(b.inicio))

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card px-8 py-4">
      <SelectField label="Ronda" value={rondaId} onChange={onRondaChange}>
        {rondas.length === 0 ? (
          <option value="">Sin rondas</option>
        ) : (
          rondas.map((r) => (
            <option key={r.id} value={r.id}>
              {fmtRangoConAnio(r.inicio, r.fin)}
            </option>
          ))
        )}
      </SelectField>

      <div className="flex items-center gap-4">
        <SelectField
          label="Sector"
          value={state.sectorActivoId}
          onChange={seleccionarSector}
        >
          {state.sectores.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </SelectField>

        <SelectField label="Zona" value={zonaFiltro} onChange={onZonaChange}>
          <option value="todos">Todos</option>
          {zonas.map((z) => (
            <option key={z.id} value={z.id}>
              {z.nombre}
            </option>
          ))}
        </SelectField>
      </div>
    </header>
  )
}
