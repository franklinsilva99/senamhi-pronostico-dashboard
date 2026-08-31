"use client"

import { Eye, Pencil, Plus, Trash2 } from "lucide-react"
import { nivelAviso } from "@/lib/aviso"
import { fmtFechaISO } from "@/lib/fechas"
import type { Aviso } from "@/lib/types"

function Badge({
  tone,
  children,
}: {
  tone: "alta" | "moderada" | "publicado" | "cargado"
  children: React.ReactNode
}) {
  const styles: Record<string, string> = {
    alta: "bg-red-100 text-red-800 border-red-300",
    moderada: "bg-yellow-100 text-yellow-800 border-yellow-300",
    publicado: "bg-green-100 text-green-800 border-green-300",
    cargado: "bg-yellow-100 text-yellow-800 border-yellow-300",
  }
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-bold border ${styles[tone]}`}
    >
      {children}
    </span>
  )
}

function ActionButton({
  title,
  tone = "default",
  onClick,
  children,
}: {
  title: string
  tone?: "default" | "secondary" | "danger"
  onClick: () => void
  children: React.ReactNode
}) {
  const tones: Record<string, string> = {
    default: "text-primary border-border hover:bg-accent",
    secondary: "text-primary border-border hover:bg-accent",
    danger: "text-destructive border-destructive/30 hover:bg-destructive/10",
  }
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded-md border bg-card transition-colors ${tones[tone]}`}
    >
      {children}
    </button>
  )
}

export function AvisoListado({
  avisos,
  onCrear,
  onVer,
  onEditar,
  onEliminar,
}: {
  avisos: Aviso[]
  onCrear: () => void
  onVer: (id: string) => void
  onEditar: (id: string) => void
  onEliminar: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Avisos Meteorológicos
        </h2>
        <button
          type="button"
          onClick={onCrear}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Crear Aviso
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">#Aviso</th>
                <th className="px-3 py-2 text-center">#Mapa</th>
                <th className="px-3 py-2 text-center">Nivel</th>
                <th className="px-3 py-2 text-center">Emisión</th>
                <th className="px-3 py-2 text-center">Inicio</th>
                <th className="px-3 py-2 text-center">Fin</th>
                <th className="px-3 py-2 text-center">#Sede</th>
                <th className="px-3 py-2 text-center">Estado</th>
                <th className="px-3 py-2 text-center">#Evento</th>
                <th className="px-3 py-2 text-center">Responsable</th>
                <th className="px-3 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {avisos.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-3 py-8 text-center text-sm italic text-muted-foreground"
                  >
                    No hay avisos. Usa el botón &quot;Crear Aviso&quot;.
                  </td>
                </tr>
              ) : (
                avisos.map((a) => {
                  const nivel = nivelAviso(a)
                  return (
                    <tr
                      key={a.id}
                      className="border-b border-border/60 transition-colors last:border-b-0 hover:bg-accent/40"
                    >
                      <td className="px-3 py-2 font-mono text-xs text-foreground">
                        {a.codigo || "—"}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {a.mapa_url ? (
                          <img
                            src={a.mapa_url}
                            alt="Mapa"
                            className="inline-block h-9 w-9 rounded border border-border object-cover"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <Badge tone={nivel === "Alta" ? "alta" : "moderada"}>
                          {nivel}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-center font-mono text-xs">
                        {fmtFechaISO(a.fecha_emision)}
                      </td>
                      <td className="px-3 py-2 text-center font-mono text-xs">
                        {fmtFechaISO(a.valido_desde)}
                      </td>
                      <td className="px-3 py-2 text-center font-mono text-xs">
                        {fmtFechaISO(a.valido_hasta)}
                      </td>
                      <td className="px-3 py-2 text-center text-muted-foreground">
                        {a.sede || "—"}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <Badge tone={a.estado === "Publicado" ? "publicado" : "cargado"}>
                          {a.estado}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-center">{a.evento || "—"}</td>
                      <td className="px-3 py-2 text-center text-muted-foreground">
                        {a.responsable || "—"}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-center gap-1">
                          <ActionButton title="Ver" onClick={() => onVer(a.id)}>
                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                          </ActionButton>
                          <ActionButton title="Editar" onClick={() => onEditar(a.id)}>
                            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                          </ActionButton>
                          <ActionButton
                            title="Eliminar"
                            tone="danger"
                            onClick={() => onEliminar(a.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
