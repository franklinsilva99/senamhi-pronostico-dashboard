"use client"

import { X } from "lucide-react"
import { NIVEL_COLOR, duracionHoras } from "@/lib/aviso"
import { fmtDateTimeISO, fmtFechaISO, fechaLargaCorta } from "@/lib/fechas"
import type { Aviso } from "@/lib/types"

export function AvisoDetalle({
  aviso,
  onCerrar,
}: {
  aviso: Aviso
  onCerrar: () => void
}) {
  const horas = duracionHoras(aviso.inicio_evento, aviso.fin_evento)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onCerrar}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-foreground">
                Aviso N° {aviso.numero || "—"}
              </span>
              <span
                className={`inline-block rounded px-2 py-0.5 text-xs font-bold border ${NIVEL_COLOR[aviso.nivel].badge}`}
              >
                {aviso.nivel}
              </span>
              <span className="rounded px-2 py-0.5 text-xs font-bold border bg-green-100 text-green-800 border-green-300">
                {aviso.estado}
              </span>
            </div>
            <h3 className="text-lg font-bold uppercase text-foreground">
              {aviso.titulo || "—"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
          <div className="text-muted-foreground">
            Emisión:{" "}
            <strong className="font-mono text-foreground">
              {fmtDateTimeISO(aviso.fecha_emision)}
            </strong>
          </div>
          <div className="text-muted-foreground">
            Inicio del evento:{" "}
            <strong className="font-mono text-foreground">
              {fmtDateTimeISO(aviso.inicio_evento)}
            </strong>
          </div>
          <div className="text-muted-foreground">
            Fin del evento:{" "}
            <strong className="font-mono text-foreground">
              {fmtDateTimeISO(aviso.fin_evento)}
            </strong>
          </div>
          <div className="text-muted-foreground">
            Vigencia:{" "}
            <strong className="font-mono text-foreground">
              {horas != null ? `${horas} horas` : "—"}
            </strong>
          </div>
        </div>

        <div className="mb-4 text-sm text-muted-foreground">
          Departamentos alertados:{" "}
          <strong className="text-foreground">{aviso.departamentos || "—"}</strong>
        </div>

        {aviso.cuerpo && (
          <p className="mb-4 whitespace-pre-line text-sm leading-relaxed text-foreground">
            {aviso.cuerpo}
          </p>
        )}

        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Pronóstico por día
        </h4>
        <div className="flex flex-col gap-3">
          {aviso.dias.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Sin detalle por día.
            </div>
          ) : (
            aviso.dias.map((dia) => (
              <div
                key={dia.id}
                className="rounded-lg border border-border p-3"
              >
                <p className="mb-1 text-sm font-bold text-foreground">
                  {dia.fecha ? fechaLargaCorta(dia.fecha) : "—"}
                </p>
                {dia.mapa_url && (
                  <img
                    src={dia.mapa_url}
                    alt="Mapa del día"
                    className="mb-2 max-h-64 w-full rounded border border-border object-contain"
                  />
                )}
                <p className="whitespace-pre-line text-sm text-muted-foreground">
                  {dia.descripcion || "—"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
