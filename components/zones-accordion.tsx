"use client"

import { useState } from "react"
import { Minus, Pencil, Plus, Trash2 } from "lucide-react"
import { useStore } from "@/lib/store"
import { fechaLargaCorta, fmtCortoConDia } from "@/lib/fechas"
import type { Pronostico, Zona } from "@/lib/types"

function PronosticoView({
  pronostico,
  onEditar,
}: {
  pronostico: Pronostico
  onEditar: (rondaId: string, zonaId: string) => void
}) {
  const { eliminarPronostico } = useStore()

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-3 py-2">
        <span className="text-xs font-semibold text-foreground">
          Ronda {fmtCortoConDia(pronostico.inicio)} –{" "}
          {fmtCortoConDia(pronostico.fin)}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEditar(pronostico.rondaId, pronostico.zonaId)}
            aria-label="Editar pronóstico"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => eliminarPronostico(pronostico.id)}
            aria-label="Eliminar pronóstico"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        {pronostico.dias.map((dia) => (
          <div
            key={dia.fecha}
            className="flex flex-wrap items-center gap-3 border-b border-border/70 px-3 py-2.5 last:border-b-0"
          >
            <span className="w-48 shrink-0 text-sm text-foreground">
              {fechaLargaCorta(dia.fecha)}
            </span>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Mín</span>
              <span className="font-semibold text-foreground">{dia.tMin}°</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Máx</span>
              <span className="font-semibold text-foreground">{dia.tMax}°</span>
            </div>
            <span className="min-w-40 flex-1 text-sm text-muted-foreground">
              {dia.descripcion || "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ZoneCard({
  zona,
  onEditar,
}: {
  zona: Zona
  onEditar: (rondaId: string, zonaId: string) => void
}) {
  const { state } = useStore()
  const [open, setOpen] = useState(false)

  const estaciones = state.estaciones.filter((e) => e.zonaId === zona.id)
  const pronosticos = state.pronosticos
    .filter((p) => p.zonaId === zona.id)
    .sort((a, b) => a.inicio.localeCompare(b.inicio))

  return (
    <div className="rounded-xl border border-border">
      <div className="p-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between rounded-lg bg-accent px-4 py-3 text-left transition-colors hover:bg-accent/80"
        >
          <span className="text-sm font-semibold text-accent-foreground">
            {zona.nombre}{" "}
            <span className="font-normal italic text-muted-foreground">
              ({estaciones.length}{" "}
              {estaciones.length === 1 ? "estación" : "estaciones"})
            </span>
          </span>
          {open ? (
            <Minus className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
          ) : (
            <Plus className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
          )}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-3 px-4 pb-4">
          {estaciones.length > 0 ? (
            <div className="rounded-lg border border-border bg-muted/30 px-3 py-2">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Estaciones
              </p>
              <ul className="flex flex-wrap gap-2">
                {estaciones.map((e) => (
                  <li
                    key={e.id}
                    className="rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground"
                  >
                    {e.nombre}
                    <span className="ml-1 text-[10px] text-muted-foreground">
                      ({e.codigo})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-xs italic text-muted-foreground">
              Sin estaciones meteorológicas.
            </p>
          )}

          {pronosticos.length === 0 && (
            <p className="text-xs italic text-muted-foreground">
              Sin pronósticos. Edítalos en la pestaña Mapa.
            </p>
          )}

          {pronosticos.map((p) => (
            <PronosticoView key={p.id} pronostico={p} onEditar={onEditar} />
          ))}
        </div>
      )}
    </div>
  )
}

export function ZonesAccordion({
  onEditar,
}: {
  onEditar: (rondaId: string, zonaId: string) => void
}) {
  const { state } = useStore()
  const zonas = state.zonas.filter((z) => z.sectorId === state.sectorActivoId)

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3">
        {zonas.map((z) => (
          <ZoneCard key={z.id} zona={z} onEditar={onEditar} />
        ))}
      </div>
    </div>
  )
}
