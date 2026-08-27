"use client"

import { useStore } from "@/lib/store"
import { fmtTituloRango } from "@/lib/fechas"

export function RangoBadge() {
  const { state } = useStore()
  const { rango } = state
  const valido = rango.inicio !== "" && rango.fin !== "" && rango.inicio <= rango.fin

  return (
    <span className="rounded-full bg-forecast/15 px-3 py-1 text-xs font-semibold text-forecast-foreground">
      {valido
        ? `Pronóstico · ${fmtTituloRango(rango.inicio, rango.fin)}`
        : "Pronóstico · sin rango"}
    </span>
  )
}
