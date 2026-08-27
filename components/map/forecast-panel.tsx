"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { useStore } from "@/lib/store"
import { HOY } from "@/lib/seed"
import { fmtCortoConDia, fmtRangoConAnio, rangoFechas } from "@/lib/fechas"
import { generarId } from "@/lib/utils"
import type { Pronostico, Ronda, Zona } from "@/lib/types"

function ZonaEditor({
  zona,
  ronda,
  existente,
  onGuardar,
  onEliminar,
}: {
  zona: Zona
  ronda: Ronda
  existente?: Pronostico
  onGuardar: (pronostico: Pronostico) => void
  onEliminar: (id: string) => void
}) {
  const fechas = rangoFechas(ronda.inicio, ronda.fin)
  const [valores, setValores] = useState<
    Record<string, { min: string; max: string; desc: string }>
  >(() => {
    const init: Record<string, { min: string; max: string; desc: string }> = {}
    for (const f of fechas) {
      const d = existente?.dias.find((x) => x.fecha === f)
      init[f] = {
        min: d ? String(d.tMin) : "",
        max: d ? String(d.tMax) : "",
        desc: d?.descripcion ?? "",
      }
    }
    return init
  })

  const setCampo = (
    fecha: string,
    campo: "min" | "max" | "desc",
    valor: string
  ) => {
    setValores((v) => ({
      ...v,
      [fecha]: { ...v[fecha], [campo]: valor },
    }))
  }

  const guardar = () => {
    onGuardar({
      id: existente?.id ?? generarId(),
      zonaId: zona.id,
      rondaId: ronda.id,
      inicio: ronda.inicio,
      fin: ronda.fin,
      dias: fechas.map((fecha) => ({
        fecha,
        tMin: Number(valores[fecha]?.min) || 0,
        tMax: Number(valores[fecha]?.max) || 0,
        descripcion: valores[fecha]?.desc ?? "",
      })),
      fechaCreacion: existente?.fechaCreacion ?? HOY,
    })
  }

  return (
    <div className="border-b border-border/70">
      <div className="flex items-center justify-between gap-2 bg-accent/60 px-4 py-1.5">
        <span className="text-[11px] font-semibold text-accent-foreground">
          {zona.nombre}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={guardar}
            className="rounded-md bg-forecast px-2.5 py-0.5 text-[10px] font-semibold text-forecast-foreground transition-colors hover:opacity-90"
          >
            Guardar
          </button>
          {existente && (
            <button
              type="button"
              onClick={() => onEliminar(existente.id)}
              aria-label={`Eliminar pronóstico de ${zona.nombre}`}
              className="flex h-5 w-6 items-center justify-center rounded border border-input bg-card text-muted-foreground hover:bg-accent"
            >
              <Trash2 className="h-3 w-3" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {fechas.map((fecha) => (
        <div key={fecha} className="flex items-center gap-2 px-4 py-1.5">
          <span className="w-20 shrink-0 text-[11px] text-muted-foreground">
            {fmtCortoConDia(fecha)}
          </span>
          <input
            type="number"
            value={valores[fecha]?.max ?? ""}
            onChange={(e) => setCampo(fecha, "max", e.target.value)}
            placeholder="Máx"
            aria-label={`Temperatura máxima ${fecha}`}
            className="h-6 w-12 shrink-0 rounded border border-input bg-card text-center text-[11px] text-foreground outline-none focus:border-ring"
          />
          <input
            type="number"
            value={valores[fecha]?.min ?? ""}
            onChange={(e) => setCampo(fecha, "min", e.target.value)}
            placeholder="Mín"
            aria-label={`Temperatura mínima ${fecha}`}
            className="h-6 w-12 shrink-0 rounded border border-input bg-card text-center text-[11px] text-foreground outline-none focus:border-ring"
          />
          <input
            type="text"
            value={valores[fecha]?.desc ?? ""}
            onChange={(e) => setCampo(fecha, "desc", e.target.value)}
            placeholder="Descripción del pronóstico…"
            aria-label={`Descripción ${fecha}`}
            className="h-6 min-w-0 flex-1 rounded border border-input bg-card px-2.5 text-[11px] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </div>
      ))}
    </div>
  )
}

export function ForecastPanel({
  rondaId,
  zonaFiltro,
}: {
  rondaId: string
  zonaFiltro: string
}) {
  const { state, guardarPronostico, eliminarPronostico } = useStore()

  const ronda = state.rondas.find((r) => r.id === rondaId)
  const zonas = state.zonas.filter(
    (z) =>
      z.sectorId === state.sectorActivoId &&
      (zonaFiltro === "todos" || z.id === zonaFiltro)
  )

  if (!ronda) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center text-xs italic text-muted-foreground">
        No hay rondas en este sector. Créalas en el calendario.
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 pb-2">
        <p className="text-xs font-bold text-foreground">
          Pronóstico · {fmtRangoConAnio(ronda.inicio, ronda.fin)}
        </p>
      </div>

      <div className="flex items-center gap-2 border-b border-border px-4 py-1.5">
        <span className="w-20 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Fecha
        </span>
        <span className="w-12 shrink-0 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Máx
        </span>
        <span className="w-12 shrink-0 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Mín
        </span>
        <span className="flex-1 pl-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Descripción
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {zonas.map((z) => {
          const existente = state.pronosticos.find(
            (p) => p.zonaId === z.id && p.rondaId === ronda.id
          )
          return (
            <ZonaEditor
              key={`${z.id}-${ronda.id}`}
              zona={z}
              ronda={ronda}
              existente={existente}
              onGuardar={guardarPronostico}
              onEliminar={eliminarPronostico}
            />
          )
        })}
      </div>
    </div>
  )
}
