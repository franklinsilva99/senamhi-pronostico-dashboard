"use client"

import { useState } from "react"
import { Save, Trash2, X } from "lucide-react"
import { REGIONES_AVISO } from "@/lib/aviso"
import { generarId } from "@/lib/utils"
import type { Aviso, RegionAviso } from "@/lib/types"

function toLocalInput(iso: string): string {
  return iso ? iso.slice(0, 16) : ""
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  )
}

const inputCls =
  "w-full rounded-md border border-input bg-card px-2.5 py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"

export function AvisoForm({
  inicial,
  onGuardar,
  onCancelar,
}: {
  inicial: Aviso
  onGuardar: (aviso: Aviso) => void
  onCancelar: () => void
}) {
  const [draft, setDraft] = useState<Aviso>(inicial)

  const set = <K extends keyof Aviso>(key: K, value: Aviso[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  const setPerspectiva = (reg: RegionAviso, value: string) =>
    setDraft((d) => ({
      ...d,
      perspectivas: { ...d.perspectivas, [reg]: value },
    }))

  const setDetalle = <K extends keyof Aviso["detalles"][RegionAviso]>(
    reg: RegionAviso,
    key: K,
    value: Aviso["detalles"][RegionAviso][K]
  ) =>
    setDraft((d) => ({
      ...d,
      detalles: {
        ...d.detalles,
        [reg]: { ...d.detalles[reg], [key]: value },
      },
    }))

  const onArchivo = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => set("mapa_url", String(reader.result))
    reader.readAsDataURL(file)
  }

  const guardar = () => {
    onGuardar({ ...draft, id: draft.id || generarId() })
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground">
          {inicial.id ? "Editar Aviso" : "Crear Aviso"}
        </h3>
        <button
          type="button"
          onClick={onCancelar}
          aria-label="Cerrar"
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Código">
          <input
            type="text"
            value={draft.codigo}
            onChange={(e) => set("codigo", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Título">
          <input
            type="text"
            value={draft.titulo}
            onChange={(e) => set("titulo", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Evento">
          <input
            type="text"
            value={draft.evento}
            onChange={(e) => set("evento", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="#Sede">
          <input
            type="text"
            value={draft.sede}
            onChange={(e) => set("sede", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Responsable">
          <input
            type="text"
            value={draft.responsable}
            onChange={(e) => set("responsable", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Estado">
          <select
            value={draft.estado}
            onChange={(e) => set("estado", e.target.value as Aviso["estado"])}
            className={inputCls}
          >
            <option value="Cargado">Cargado</option>
            <option value="Publicado">Publicado</option>
          </select>
        </Field>
        <Field label="Fecha de emisión">
          <input
            type="datetime-local"
            value={toLocalInput(draft.fecha_emision)}
            onChange={(e) => set("fecha_emision", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Válido desde">
          <input
            type="datetime-local"
            value={toLocalInput(draft.valido_desde)}
            onChange={(e) => set("valido_desde", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Válido hasta">
          <input
            type="datetime-local"
            value={toLocalInput(draft.valido_hasta)}
            onChange={(e) => set("valido_hasta", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Próxima actualización">
          <input
            type="datetime-local"
            value={toLocalInput(draft.proxima_actualizacion)}
            onChange={(e) => set("proxima_actualizacion", e.target.value)}
            className={inputCls}
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Departamentos alertados">
            <textarea
              rows={2}
              value={draft.departamentos_alertados}
              onChange={(e) => set("departamentos_alertados", e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
      </div>

      <h4 className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Perspectivas por región
      </h4>
      <div className="flex flex-col gap-3">
        {REGIONES_AVISO.map((reg) => {
          const txt = draft.perspectivas[reg] ?? ""
          return (
            <div key={reg}>
              <label className="mb-1 block text-sm font-semibold text-foreground">
                {reg}
              </label>
              <textarea
                rows={3}
                maxLength={1000}
                value={txt}
                onChange={(e) => setPerspectiva(reg, e.target.value)}
                className={inputCls}
              />
              <div className="mt-0.5 text-right font-mono text-xs text-muted-foreground">
                {txt.length}/1000
              </div>
            </div>
          )
        })}
      </div>

      <h4 className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Detalles técnicos por región
      </h4>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <th className="px-3 py-2">Región</th>
              <th className="px-3 py-2">Tipo de precipitación</th>
              <th className="px-3 py-2">Máx. cantidad PP (mm/24h)</th>
              <th className="px-3 py-2">Probabilidad</th>
              <th className="px-3 py-2">Fenómenos asociados</th>
            </tr>
          </thead>
          <tbody>
            {REGIONES_AVISO.map((reg) => {
              const dt = draft.detalles[reg]
              return (
                <tr
                  key={reg}
                  className="border-b border-border/60 last:border-b-0"
                >
                  <td className="px-3 py-2 font-bold text-foreground">{reg}</td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={dt.tipo_precipitacion}
                      onChange={(e) =>
                        setDetalle(reg, "tipo_precipitacion", e.target.value)
                      }
                      className={inputCls}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      placeholder="ej. 5 – 20"
                      value={dt.max_cantidad_pp}
                      onChange={(e) =>
                        setDetalle(reg, "max_cantidad_pp", e.target.value)
                      }
                      className={`${inputCls} w-24`}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={dt.probabilidad}
                      onChange={(e) =>
                        setDetalle(
                          reg,
                          "probabilidad",
                          e.target.value as "A" | "M"
                        )
                      }
                      className={inputCls}
                    >
                      <option value="A">A - Alta (&gt;60%)</option>
                      <option value="M">M - Moderada (40-60%)</option>
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={dt.fenomenos_asociados}
                      onChange={(e) =>
                        setDetalle(reg, "fenomenos_asociados", e.target.value)
                      }
                      className={inputCls}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Mapa del aviso
        </span>
        <div className="flex items-center gap-4">
          {draft.mapa_url && (
            <img
              src={draft.mapa_url}
              alt="Mapa del aviso"
              className="h-32 w-32 rounded border border-border object-cover"
            />
          )}
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onArchivo(e.target.files?.[0])}
              className="text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/80"
            />
            {draft.mapa_url && (
              <button
                type="button"
                onClick={() => set("mapa_url", "")}
                className="inline-flex items-center gap-1 text-sm font-medium text-destructive hover:underline"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Quitar imagen
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={guardar}
          disabled={!draft.codigo.trim() || !draft.titulo.trim()}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 disabled:opacity-50"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Guardar Aviso
        </button>
      </div>
    </div>
  )
}
