"use client"

import { X } from "lucide-react"
import { nivelAviso, REGIONES_AVISO } from "@/lib/aviso"
import { fmtDateTimeISO, fmtFechaISO } from "@/lib/fechas"
import type { Aviso } from "@/lib/types"

function Badge({ tone, children }: { tone: "alta" | "moderada" | "estado"; children: React.ReactNode }) {
  const styles: Record<string, string> = {
    alta: "bg-red-100 text-red-800 border-red-300",
    moderada: "bg-yellow-100 text-yellow-800 border-yellow-300",
    estado: "bg-green-100 text-green-800 border-green-300",
  }
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold border ${styles[tone]}`}>
      {children}
    </span>
  )
}

export function AvisoDetalle({
  aviso,
  onCerrar,
}: {
  aviso: Aviso
  onCerrar: () => void
}) {
  const nivel = nivelAviso(aviso)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onCerrar}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-mono text-sm font-bold text-foreground">
            {aviso.codigo || "—"}
          </h3>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <p className="mb-3 text-base font-bold text-foreground">
          {aviso.titulo || "—"}
        </p>

        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <Badge tone="estado">{aviso.estado}</Badge>
          <Badge tone={nivel === "Alta" ? "alta" : "moderada"}>
            Nivel {nivel}
          </Badge>
          <span className="text-muted-foreground">
            Sede: <strong className="text-foreground">{aviso.sede || "—"}</strong>
          </span>
          <span className="text-muted-foreground">
            Evento: <strong className="text-foreground">{aviso.evento || "—"}</strong>
          </span>
          <span className="text-muted-foreground">
            Responsable:{" "}
            <strong className="text-foreground">{aviso.responsable || "—"}</strong>
          </span>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
          <div className="text-muted-foreground">
            Emisión:{" "}
            <strong className="font-mono text-foreground">
              {fmtDateTimeISO(aviso.fecha_emision)}
            </strong>
          </div>
          <div className="text-muted-foreground">
            Válido:{" "}
            <strong className="font-mono text-foreground">
              {fmtFechaISO(aviso.valido_desde)} → {fmtFechaISO(aviso.valido_hasta)}
            </strong>
          </div>
          <div className="text-muted-foreground">
            Próx. actualización:{" "}
            <strong className="font-mono text-foreground">
              {fmtDateTimeISO(aviso.proxima_actualizacion)}
            </strong>
          </div>
          <div className="text-muted-foreground">
            Deptos alertados:{" "}
            <strong className="text-foreground">
              {aviso.departamentos_alertados || "—"}
            </strong>
          </div>
        </div>

        {aviso.mapa_url && (
          <img
            src={aviso.mapa_url}
            alt="Mapa"
            className="mb-4 max-h-64 w-full rounded border border-border object-contain"
          />
        )}

        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Perspectivas
        </h4>
        <div className="mb-4 flex flex-col gap-2">
          {REGIONES_AVISO.map((reg) => (
            <div key={reg} className="text-sm">
              <span className="font-bold text-foreground">{reg}: </span>
              <span className="text-muted-foreground">
                {aviso.perspectivas[reg] || "—"}
              </span>
            </div>
          ))}
        </div>

        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Detalles técnicos
        </h4>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">Región</th>
                <th className="px-3 py-2">Tipo de precipitación</th>
                <th className="px-3 py-2">Máx. PP (mm/24h)</th>
                <th className="px-3 py-2">Probabilidad</th>
                <th className="px-3 py-2">Fenómenos asociados</th>
              </tr>
            </thead>
            <tbody>
              {REGIONES_AVISO.map((reg) => {
                const dt = aviso.detalles[reg]
                return (
                  <tr key={reg} className="border-b border-border/60 last:border-b-0">
                    <td className="px-3 py-2 font-bold text-foreground">{reg}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {dt?.tipo_precipitacion || "—"}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {dt?.max_cantidad_pp || "—"}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {dt?.probabilidad || "—"}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {dt?.fenomenos_asociados || "—"}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
