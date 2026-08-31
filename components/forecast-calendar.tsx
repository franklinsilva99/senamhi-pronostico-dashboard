"use client"

import { useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useStore } from "@/lib/store"
import { HOY } from "@/lib/seed"
import {
  addDaysISO,
  estadoDiaSector,
  fmtRangoConAnio,
  fmtTituloRango,
  fromISO,
  nombreDiaCorto,
  rondaCompleta,
} from "@/lib/fechas"
import { generarId } from "@/lib/utils"
import type { DiaEstado } from "@/lib/types"

type Day = {
  iso: string
  n: number
  weekday: string
  state: DiaEstado
}

const stateStyles: Record<DiaEstado, string> = {
  forecast: "texture-forecast border-forecast text-forecast-foreground",
  process: "bg-process/40 border-process text-process-foreground",
  noforecast:
    "texture-noforecast border-noforecast text-noforecast-foreground",
  empty: "border-border bg-card text-muted-foreground",
}

const legend = [
  { label: "PRONOSTICADO", color: "bg-forecast" },
  { label: "EN PROCESO", color: "bg-process" },
  { label: "SIN PRONÓSTICO", color: "bg-noforecast" },
]

export function ForecastCalendar({
  onEditar,
}: {
  onEditar: (rondaId: string) => void
}) {
  const { state, crearRonda, setRango, eliminarRonda } = useStore()
  const { rango } = state

  const [creando, setCreando] = useState(false)
  const [nuevaInicio, setNuevaInicio] = useState("")
  const [nuevaFin, setNuevaFin] = useState("")

  const days: Day[] = []
  let cursor = rango.inicio
  while (cursor <= rango.fin) {
    const d = fromISO(cursor)
    days.push({
      iso: cursor,
      n: d.getDate(),
      weekday: nombreDiaCorto(cursor),
      state: estadoDiaSector(
        cursor,
        state.sectorActivoId,
        state.zonas,
        state.rondas,
        state.pronosticos
      ),
    })
    cursor = addDaysISO(cursor, 1)
  }

  const rangoValido =
    rango.inicio !== "" && rango.fin !== "" && rango.inicio <= rango.fin
  const titulo = rangoValido ? fmtTituloRango(rango.inicio, rango.fin) : ""
  const cols = Math.min(days.length, 7)

  const abrirCrear = () => {
    const primerAzul = days.find((d) => d.state === "noforecast")?.iso
    const inicio = primerAzul ?? rango.inicio
    setNuevaInicio(inicio)
    setNuevaFin(addDaysISO(inicio, 2))
    setCreando(true)
  }

  const confirmarCrear = () => {
    if (!nuevaInicio || !nuevaFin || nuevaInicio > nuevaFin) return
    crearRonda({
      id: generarId(),
      sectorId: state.sectorActivoId,
      inicio: nuevaInicio,
      fin: nuevaFin,
      fechaCreacion: HOY,
    })
    setRango({ inicio: nuevaInicio, fin: nuevaFin })
    setCreando(false)
  }

  const zonasSector = state.zonas.filter(
    (z) => z.sectorId === state.sectorActivoId
  )
  const rondasSector = state.rondas
    .filter((r) => r.sectorId === state.sectorActivoId)
    .sort((a, b) => a.inicio.localeCompare(b.inicio))

  const eliminar = (id: string) => {
    if (window.confirm("¿Eliminar esta ronda y todos sus pronósticos?")) {
      eliminarRonda(id)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 rounded-lg bg-accent px-3 py-2">
          <span className="text-sm font-semibold capitalize text-accent-foreground">
            {rangoValido ? titulo : "Rango de fechas"}
          </span>
          <button
            type="button"
            onClick={abrirCrear}
            className="inline-flex items-center gap-1.5 rounded-md bg-forecast px-3 py-1.5 text-xs font-semibold text-forecast-foreground transition-colors hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Crear pronóstico
          </button>
        </div>

        {creando && (
          <div className="mt-3 flex flex-wrap items-end gap-3 rounded-lg border border-primary/40 bg-primary/5 p-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                Desde
              </span>
              <input
                type="date"
                value={nuevaInicio}
                onChange={(e) => setNuevaInicio(e.target.value)}
                className="rounded-md border border-input bg-card px-2 py-1.5 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                Hasta
              </span>
              <input
                type="date"
                value={nuevaFin}
                onChange={(e) => setNuevaFin(e.target.value)}
                className="rounded-md border border-input bg-card px-2 py-1.5 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </label>
            <button
              type="button"
              onClick={confirmarCrear}
              disabled={!nuevaInicio || !nuevaFin || nuevaInicio > nuevaFin}
              className="rounded-md bg-forecast px-3 py-1.5 text-sm font-semibold text-forecast-foreground transition-colors hover:opacity-90 disabled:opacity-50"
            >
              Crear
            </button>
            <button
              type="button"
              onClick={() => setCreando(false)}
              className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Cancelar
            </button>
          </div>
        )}

        {rangoValido ? (
          <>
            {/* Fila intermedia: días con estado */}
            <div
              className="mt-3 grid gap-2"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {days.map((d) => (
                <div
                  key={d.iso}
                  className={`flex flex-col items-center rounded-lg border py-2 ${stateStyles[d.state]}`}
                >
                  <span className="text-[11px] font-medium uppercase opacity-70">
                    {d.weekday}
                  </span>
                  <span className="text-lg font-bold leading-tight">{d.n}</span>
                </div>
              ))}
            </div>

          </>
        ) : (
          <p className="mt-3 px-1 text-sm italic text-muted-foreground">
            Selecciona un rango válido (la fecha fin debe ser igual o posterior a
            la fecha inicio).
          </p>
        )}

        <div className="mt-4 border-t border-border pt-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Rondas de pronóstico
          </p>
          {rondasSector.length === 0 ? (
            <p className="text-xs italic text-muted-foreground">
              Sin rondas creadas.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {rondasSector.map((r) => {
                const completa = rondaCompleta(
                  r.id,
                  zonasSector,
                  state.pronosticos
                )
                return (
                  <li
                    key={r.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-medium text-foreground">
                        {fmtRangoConAnio(r.inicio, r.fin)}
                      </span>
                      {completa ? (
                        <span className="rounded-full bg-forecast/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-forecast-foreground">
                          Pronosticado
                        </span>
                      ) : (
                        <span className="rounded-full bg-process/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-process-foreground">
                          En proceso
                        </span>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEditar(r.id)}
                        aria-label={`Editar ronda ${fmtRangoConAnio(r.inicio, r.fin)}`}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => eliminar(r.id)}
                        aria-label={`Eliminar ronda ${fmtRangoConAnio(r.inicio, r.fin)}`}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex flex-col justify-center gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-sm">
        {legend.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-3">
            <span
              className={`h-4 w-4 shrink-0 rounded-full ${color}`}
              aria-hidden="true"
            />
            <span className="text-xs font-semibold tracking-wide text-foreground">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
