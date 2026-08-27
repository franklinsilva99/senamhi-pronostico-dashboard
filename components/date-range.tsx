"use client"

import { Calendar } from "lucide-react"
import { useStore } from "@/lib/store"

function DateField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="flex flex-1 flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-2.5 shadow-sm transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
        <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          aria-label={label}
        />
      </div>
    </label>
  )
}

export function DateRange() {
  const { state, setRango } = useStore()
  const { rango } = state

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <DateField
        label="Fech. Inicio"
        value={rango.inicio}
        onChange={(inicio) => setRango({ ...rango, inicio })}
      />
      <DateField
        label="Fech. Fin"
        value={rango.fin}
        onChange={(fin) => setRango({ ...rango, fin })}
      />
    </div>
  )
}
