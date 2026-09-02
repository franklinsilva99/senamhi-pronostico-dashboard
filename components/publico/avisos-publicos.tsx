"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { AvisoPrint } from "@/components/publico/aviso-print"
import { NIVEL_COLOR, duracionHoras } from "@/lib/aviso"
import { fmtDiaMes, fmtFechaEvento, fmtFechaISO } from "@/lib/fechas"
import { useStore } from "@/lib/store"
import type { Aviso, NivelAviso } from "@/lib/types"

function BadgeNivel({ nivel }: { nivel: NivelAviso }) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-bold border ${NIVEL_COLOR[nivel].badge}`}
    >
      {nivel}
    </span>
  )
}

const ANTERIORES = "__anteriores__"

function TabAviso({ aviso }: { aviso: Aviso }) {
  const horas = duracionHoras(aviso.inicio_evento, aviso.fin_evento)
  const [diaId, setDiaId] = useState<string | null>(null)

  const diaActivo =
    aviso.dias.find((d) => d.id === diaId) ??
    aviso.dias.find((d) => d.mapa_url) ??
    aviso.dias[0]

  const descargar = () => window.print()

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-6 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-foreground">
            Aviso N° {aviso.numero || "—"}
          </span>
          <BadgeNivel nivel={aviso.nivel} />
          <span className="rounded px-2 py-0.5 text-xs font-bold border bg-green-100 text-green-800 border-green-300">
            {aviso.estado}
          </span>
        </div>
        <button
          type="button"
          onClick={descargar}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          Descargar PDF
        </button>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold uppercase text-foreground">
          {aviso.titulo || "—"}
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div className="text-muted-foreground">
            <strong className="font-semibold text-foreground">Fecha de emisión:</strong>{" "}
            {fmtFechaEvento(aviso.fecha_emision)}
          </div>
          <div className="text-muted-foreground">
            <strong className="font-semibold text-foreground">Inicio del evento:</strong>{" "}
            {fmtFechaEvento(aviso.inicio_evento)}
          </div>
          <div className="text-muted-foreground">
            <strong className="font-semibold text-foreground">Fin del evento:</strong>{" "}
            {fmtFechaEvento(aviso.fin_evento)}
          </div>
          <div className="text-muted-foreground">
            <strong className="font-semibold text-foreground">
              Periodo de vigencia del aviso:
            </strong>{" "}
            {horas != null ? `${horas} horas` : "—"}
          </div>
        </div>

        <hr className="my-4 border-border" />

        {aviso.cuerpo && (
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
            {aviso.cuerpo}
          </p>
        )}

        <div className="mt-4 text-sm text-muted-foreground">
          <strong className="font-semibold text-foreground">
            Departamentos alertados:
          </strong>{" "}
          {aviso.departamentos || "—"}
        </div>

        {aviso.dias.length > 0 && (
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {aviso.dias.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDiaId(d.id)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    diaActivo?.id === d.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:bg-accent"
                  }`}
                >
                  {d.fecha ? fmtDiaMes(d.fecha) : "—"}
                </button>
              ))}
            </div>

            {diaActivo && (
              <div className="mt-3">
                {diaActivo.mapa_url ? (
                  <img
                    src={diaActivo.mapa_url}
                    alt={`Mapa ${diaActivo.fecha}`}
                    className="max-h-80 w-full rounded border border-border object-contain"
                  />
                ) : null}
                {diaActivo.descripcion ? (
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {diaActivo.descripcion}
                  </p>
                ) : !diaActivo.mapa_url ? (
                  <div className="rounded border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                    Sin mapa para este día.
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function TablaAnteriores({
  avisos,
  onSeleccionar,
}: {
  avisos: Aviso[]
  onSeleccionar: (id: string) => void
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <th className="px-3 py-2">Aviso</th>
              <th className="px-3 py-2 text-center">Nro</th>
              <th className="px-3 py-2 text-center">Emisión</th>
              <th className="px-3 py-2 text-center">Inicio</th>
              <th className="px-3 py-2 text-center">Fin</th>
              <th className="px-3 py-2 text-center">Duración</th>
              <th className="px-3 py-2 text-center">Nivel</th>
            </tr>
          </thead>
          <tbody>
            {avisos.map((a) => {
              const horas = duracionHoras(a.inicio_evento, a.fin_evento)
              return (
                <tr
                  key={a.id}
                  onClick={() => onSeleccionar(a.id)}
                  className="cursor-pointer border-b border-border/60 transition-colors last:border-b-0 hover:bg-accent/40"
                >
                  <td className="px-3 py-2 font-semibold uppercase text-foreground">
                    {a.titulo || "—"}
                  </td>
                  <td className="px-3 py-2 text-center font-mono text-xs">
                    {a.numero || "—"}
                  </td>
                  <td className="px-3 py-2 text-center font-mono text-xs">
                    {fmtFechaISO(a.fecha_emision)}
                  </td>
                  <td className="px-3 py-2 text-center font-mono text-xs">
                    {fmtFechaISO(a.inicio_evento)}
                  </td>
                  <td className="px-3 py-2 text-center font-mono text-xs">
                    {fmtFechaISO(a.fin_evento)}
                  </td>
                  <td className="px-3 py-2 text-center font-mono text-xs">
                    {horas != null ? `${horas} Hrs.` : "—"}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <BadgeNivel nivel={a.nivel} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AvisosPublicos() {
  const { state } = useStore()

  const avisos = state.avisos
    .filter((a) => a.estado === "Publicado")
    .sort((a, b) => b.fecha_emision.localeCompare(a.fecha_emision))

  const [tab, setTab] = useState<string | null>(null)

  if (avisos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No hay avisos publicados por el momento.
      </div>
    )
  }

  const mostrandoAnteriores = tab === ANTERIORES
  const activo = avisos.find((a) => a.id === tab) ?? avisos[0]

  const tabCls = (activoId: boolean) =>
    `-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
      activoId
        ? "border-primary text-primary"
        : "border-transparent text-muted-foreground hover:text-foreground"
    }`

  return (
    <>
      <div className="flex flex-col gap-6 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Aviso Meteorológico
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Los Avisos Meteorológicos son pronósticos de carácter preventivo ante
            eventos severos, indicando las áreas que podrían verse afectadas y el
            nivel de peligrosidad.
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-1 border-b border-border bg-card px-2">
          {avisos.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setTab(a.id)}
              className={tabCls(!mostrandoAnteriores && activo.id === a.id)}
            >
              Aviso # {a.numero || "—"}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setTab(ANTERIORES)}
            className={tabCls(mostrandoAnteriores)}
          >
            Anteriores
          </button>
        </nav>

        {mostrandoAnteriores ? (
          <TablaAnteriores avisos={avisos} onSeleccionar={(id) => setTab(id)} />
        ) : (
          <TabAviso aviso={activo} />
        )}
      </div>

      <AvisoPrint aviso={activo} />
    </>
  )
}
