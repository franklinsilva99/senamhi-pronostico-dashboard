"use client"

import { useState } from "react"
import { Download, TriangleAlert } from "lucide-react"
import { AvisoPrint } from "@/components/publico/aviso-print"
import { nivelAviso, REGIONES_AVISO } from "@/lib/aviso"
import { fmtDateTimeISO, fmtFechaISO } from "@/lib/fechas"
import { useStore } from "@/lib/store"
import type { Aviso } from "@/lib/types"

function Badge({ tone, children }: { tone: "alta" | "moderada"; children: React.ReactNode }) {
  const styles: Record<string, string> = {
    alta: "bg-red-100 text-red-800 border border-red-300",
    moderada: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  }
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${styles[tone]}`}>
      {children}
    </span>
  )
}

function Leyenda({ nivel }: { nivel: "Alta" | "Moderada" }) {
  return (
    <div className="flex flex-wrap gap-6 rounded bg-muted p-3 text-xs text-muted-foreground">
      <div className="flex flex-col gap-1">
        <span className="font-semibold uppercase tracking-wide text-muted-foreground">
          Intensidad
        </span>
        <span className="inline-flex items-center gap-1.5 text-foreground">
          <span
            className={`h-3 w-3 rounded-full ${nivel === "Alta" ? "bg-red-500" : "bg-yellow-400"}`}
          />
          {nivel}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-semibold uppercase tracking-wide text-muted-foreground">
          Probabilidad
        </span>
        <span className="inline-flex items-center gap-1.5 text-foreground">
          <span className="h-3 w-3 rounded-full bg-red-500" /> A - Alta (&gt;60%)
        </span>
        <span className="inline-flex items-center gap-1.5 text-foreground">
          <span className="h-3 w-3 rounded-full bg-yellow-400" /> M - Moderada (40-60%)
        </span>
      </div>
    </div>
  )
}

function AvisoDestacado({ aviso }: { aviso: Aviso }) {
  const nivel = nivelAviso(aviso)

  const descargar = () => {
    window.print()
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-primary px-6 py-3 text-primary-foreground">
        <div className="flex flex-wrap items-center gap-3">
          <TriangleAlert className="h-4 w-4" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            Aviso meteorológico
          </span>
          <span className="font-mono text-xs">{aviso.codigo || "—"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded px-2 py-0.5 text-xs font-bold bg-primary-foreground/20 border border-primary-foreground/40">
            {aviso.estado}
          </span>
          <span className="rounded px-2 py-0.5 text-xs font-bold bg-primary-foreground/20 border border-primary-foreground/40">
            Nivel {nivel}
          </span>
          <button
            type="button"
            onClick={descargar}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary-foreground px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary-foreground/90"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            Descargar PDF
          </button>
        </div>
      </div>

      <div className="p-6">
        <h2 className="mb-6 text-xl font-bold text-foreground">
          {aviso.titulo || "—"}
        </h2>

        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col">
            {aviso.mapa_url ? (
              <div className="relative flex-1">
                <img
                  src={aviso.mapa_url}
                  alt="Mapa del aviso"
                  className="max-h-80 w-full rounded border border-border object-contain"
                />
                <div className="mt-2">
                  <Leyenda nivel={nivel} />
                </div>
              </div>
            ) : (
              <Leyenda nivel={nivel} />
            )}
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Fechas
            </h4>
            <div className="mb-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div className="text-muted-foreground">
                Fecha de emisión:
                <br />
                <strong className="font-mono text-foreground">
                  {fmtDateTimeISO(aviso.fecha_emision)}
                </strong>
              </div>
              <div className="text-muted-foreground">
                Válido desde:
                <br />
                <strong className="font-mono text-foreground">
                  {fmtFechaISO(aviso.valido_desde)}
                </strong>
              </div>
              <div className="text-muted-foreground">
                Válido hasta:
                <br />
                <strong className="font-mono text-foreground">
                  {fmtFechaISO(aviso.valido_hasta)}
                </strong>
              </div>
              <div className="text-muted-foreground">
                Próxima actualización:
                <br />
                <strong className="font-mono text-foreground">
                  {fmtDateTimeISO(aviso.proxima_actualizacion)}
                </strong>
              </div>
            </div>

            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Perspectivas
            </h4>
            {REGIONES_AVISO.map((reg) => (
              <div key={reg} className="mb-2 text-sm">
                <span className="font-bold text-foreground">{reg}: </span>
                <span className="text-muted-foreground">
                  {aviso.perspectivas[reg] || "—"}
                </span>
              </div>
            ))}

            <div className="mt-4 border-t border-border pt-3 text-sm text-muted-foreground">
              Departamentos alertados:
              <br />
              <strong className="text-foreground">
                {aviso.departamentos_alertados || "—"}
              </strong>
            </div>
          </div>
        </div>

        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Detalles técnicos
        </h4>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">Región</th>
                <th className="px-3 py-2">Tipo de precipitación</th>
                <th className="px-3 py-2">Máx. cantidad PP (mm/24h)</th>
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

export function AvisosPublicos() {
  const { state } = useStore()

  const avisos = state.avisos
    .filter((a) => a.estado === "Publicado")
    .sort((a, b) => b.fecha_emision.localeCompare(a.fecha_emision))

  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (avisos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No hay avisos publicados por el momento.
      </div>
    )
  }

  const actual =
    avisos.find((a) => a.id === selectedId) ?? avisos[0]
  const anteriores = avisos.filter((a) => a.id !== actual.id)

  return (
    <>
      <div className="flex flex-col gap-6 print:hidden">
        <AvisoDestacado aviso={actual} />

      {anteriores.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-foreground">
            Avisos anteriores
          </h3>
          <div className="flex flex-col gap-3">
            {anteriores.map((a) => {
              const nivel = nivelAviso(a)
              return (
                <div
                  key={a.id}
                  className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-bold text-foreground">
                      {a.codigo || "—"}
                    </span>
                    <Badge tone={nivel === "Alta" ? "alta" : "moderada"}>
                      Nivel {nivel}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">
                    {a.titulo || "—"}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {a.departamentos_alertados || "—"}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      Vigencia:{" "}
                      <span className="font-mono text-foreground">
                        {fmtFechaISO(a.valido_desde)} → {fmtFechaISO(a.valido_hasta)}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedId(a.id)}
                      className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
                    >
                      Ver en grande
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      </div>

      <AvisoPrint aviso={actual} />
    </>
  )
}
