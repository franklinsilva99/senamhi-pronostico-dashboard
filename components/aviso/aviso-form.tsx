"use client"

import { useEffect, useState } from "react"
import { Plus, Save, Trash2, X } from "lucide-react"
import shp from "shpjs"
import { NIVELES_AVISO, NIVEL_COLOR, duracionHoras, nivelMaximo } from "@/lib/aviso"
import { guardarMapa, leerMapa, eliminarMapa } from "@/lib/aviso-mapa-db"
import { departamentosAfectados } from "@/lib/geo"
import { AvisoMapaMini } from "@/components/publico/aviso-mapa-mini"
import { capitalizar } from "@/lib/seed"
import { generarId } from "@/lib/utils"
import type { Aviso, DiaAviso, NivelAviso } from "@/lib/types"

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

  const setDia = (index: number, patch: Partial<DiaAviso>) =>
    setDraft((d) => ({
      ...d,
      dias: d.dias.map((dia, i) => (i === index ? { ...dia, ...patch } : dia)),
    }))

  const agregarDia = () =>
    setDraft((d) => ({
      ...d,
      dias: [...d.dias, { id: generarId(), fecha: "", descripcion: "", mapa_url: "" }],
    }))

  const quitarDia = (index: number) => {
    const dia = draft.dias[index]
    if (dia?.mapa_geojson_id) void eliminarMapa(dia.mapa_geojson_id)
    setDraft((d) => ({ ...d, dias: d.dias.filter((_, i) => i !== index) }))
  }

  const [leyendoShape, setLeyendoShape] = useState<number | null>(null)

  const [derivados, setDerivados] = useState<string[] | null>(null)
  const [derivando, setDerivando] = useState(false)
  const [nivelDetectado, setNivelDetectado] = useState<NivelAviso | null>(null)
  const [mapasGeojson, setMapasGeojson] = useState<Record<string, unknown>>({})

  const mapaIds = draft.dias
    .map((d) => d.mapa_geojson_id)
    .filter((id): id is string => Boolean(id))

  useEffect(() => {
    const unicos = Array.from(new Set(mapaIds))
    if (unicos.length === 0) {
      setDerivados(null)
      setDerivando(false)
      setNivelDetectado(null)
      setMapasGeojson({})
      return
    }
    let cancelado = false
    setDerivando(true)
    Promise.all(
      unicos.map((id) =>
        leerMapa(id)
          .then((v) => ({ id, v }))
          .catch(() => ({ id, v: undefined }))
      )
    ).then((res) => {
      if (cancelado) return
      const deptos = new Set<string>()
      const geojsons: unknown[] = []
      const next: Record<string, unknown> = {}
      for (const { id, v } of res) {
        if (v === undefined) continue
        next[id] = v
        geojsons.push(v)
        for (const d of departamentosAfectados(v)) deptos.add(d)
      }
      setMapasGeojson(next)
      setDerivados(Array.from(deptos).sort().map(capitalizar))
      const nivel = nivelMaximo(geojsons)
      setNivelDetectado(nivel)
      if (nivel) set("nivel", nivel)
      setDerivando(false)
    })
    return () => {
      cancelado = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapaIds.join("|")])

  const onShapefile = async (index: number, file: File | undefined) => {
    if (!file) return
    setLeyendoShape(index)
    try {
      const buf = await file.arrayBuffer()
      const geojson = await shp(buf)
      const id = generarId()
      await guardarMapa(id, geojson)
      setDia(index, { mapa_geojson_id: id })
    } catch (err) {
      window.alert(
        "No se pudo leer el shapefile: " +
          (err instanceof Error ? err.message : String(err))
      )
    } finally {
      setLeyendoShape(null)
    }
  }

  const guardar = () => {
    onGuardar({ ...draft, id: draft.id || generarId() })
  }

  useEffect(() => {
    if (derivados && derivados.length > 0 && !draft.departamentos.trim()) {
      set("departamentos", derivados.join(", "))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [derivados])

  const usarDerivados = () => {
    if (derivados && derivados.length > 0) {
      set("departamentos", derivados.join(", "))
    }
  }

  const horas = duracionHoras(draft.inicio_evento, draft.fin_evento)

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
        <Field label="Número de aviso">
          <input
            type="text"
            placeholder="ej. 342"
            value={draft.numero}
            onChange={(e) => set("numero", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Código">
          <input
            type="text"
            value={draft.codigo}
            onChange={(e) => set("codigo", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Nivel de peligrosidad">
          <div className="flex items-center gap-2">
            <span
              className={`h-4 w-4 shrink-0 rounded-full ${
                nivelDetectado ? NIVEL_COLOR[draft.nivel].dot : "bg-neutral-400"
              }`}
            />
            <select
              value={nivelDetectado ? draft.nivel : ""}
              onChange={(e) => set("nivel", e.target.value as NivelAviso)}
              disabled={!nivelDetectado}
              className={inputCls}
            >
              <option value="" disabled>
                Sin shapefile
              </option>
              {NIVELES_AVISO.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          {nivelDetectado && (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Nivel detectado del shapefile:{" "}
              <strong className="text-foreground">{nivelDetectado}</strong>
            </p>
          )}
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
        <div className="md:col-span-2">
          <Field label="Título">
            <input
              type="text"
              value={draft.titulo}
              onChange={(e) => set("titulo", e.target.value.toUpperCase())}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Fecha de emisión">
          <input
            type="datetime-local"
            value={toLocalInput(draft.fecha_emision)}
            onChange={(e) => set("fecha_emision", e.target.value)}
            className={inputCls}
          />
        </Field>
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Inicio del evento">
              <input
                type="datetime-local"
                value={toLocalInput(draft.inicio_evento)}
                onChange={(e) => set("inicio_evento", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Fin del evento">
              <input
                type="datetime-local"
                value={toLocalInput(draft.fin_evento)}
                onChange={(e) => set("fin_evento", e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Periodo de vigencia:{" "}
            <strong className="text-foreground">
              {horas != null ? `${horas} horas` : "—"}
            </strong>
          </p>
        </div>
        <div className="md:col-span-2">
          <Field label="Departamentos alertados">
            <textarea
              rows={2}
              value={draft.departamentos}
              onChange={(e) => set("departamentos", e.target.value)}
              className={inputCls}
            />
            <div className="mt-1.5 text-xs text-muted-foreground">
              {derivando ? (
                <span className="italic">Leyendo shapefiles…</span>
              ) : derivados && derivados.length > 0 ? (
                <span className="flex flex-wrap items-center gap-2">
                  <span>
                    Departamentos detectados:{" "}
                    <strong className="text-foreground">
                      {derivados.join(", ")}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={usarDerivados}
                    className="inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-0.5 font-semibold text-foreground transition-colors hover:bg-accent"
                  >
                    Usar detectados
                  </button>
                </span>
              ) : mapaIds.length > 0 ? (
                "No se detectaron departamentos."
              ) : (
                "Carga un shapefile por día para derivar los departamentos."
              )}
            </div>
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Cuerpo del aviso">
            <textarea
              rows={6}
              value={draft.cuerpo}
              onChange={(e) => set("cuerpo", e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
      </div>

      <div className="mb-2 mt-6 flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Pronóstico por día
        </h4>
        <button
          type="button"
          onClick={agregarDia}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Agregar día
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {draft.dias.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Sin días. Usa &quot;Agregar día&quot; para detallar el pronóstico.
          </div>
        ) : (
          draft.dias.map((dia, i) => (
            <div
              key={dia.id}
              className="rounded-lg border border-border p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <Field label="Fecha">
                  <input
                    type="date"
                    value={dia.fecha ? dia.fecha.slice(0, 10) : ""}
                    onChange={(e) => setDia(i, { fecha: e.target.value })}
                    className={`${inputCls} w-44`}
                  />
                </Field>
                <button
                  type="button"
                  onClick={() => quitarDia(i)}
                  aria-label="Quitar día"
                  className="mt-4 inline-flex items-center gap-1 rounded-md border border-destructive/30 px-2 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Quitar
                </button>
              </div>

              <Field label="Descripción">
                <textarea
                  rows={3}
                  value={dia.descripcion}
                  onChange={(e) => setDia(i, { descripcion: e.target.value })}
                  className={inputCls}
                />
              </Field>

              <div className="mt-2 flex flex-wrap items-center gap-3 rounded-md border border-border/70 bg-muted/20 px-3 py-2">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Mapa vectorial (shapefile .zip)
                  </span>
                  <input
                    type="file"
                    accept=".zip"
                    disabled={leyendoShape === i}
                    onChange={(e) => onShapefile(i, e.target.files?.[0])}
                    className="text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/80 disabled:opacity-60"
                  />
                </div>
                {leyendoShape === i && (
                  <span className="text-xs italic text-muted-foreground">
                    Leyendo shapefile…
                  </span>
                )}
                {Boolean(dia.mapa_geojson_id) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (dia.mapa_geojson_id) void eliminarMapa(dia.mapa_geojson_id)
                      setDia(i, { mapa_geojson_id: undefined })
                    }}
                    className="inline-flex items-center gap-1 text-sm font-medium text-destructive hover:underline"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Quitar mapa vectorial
                  </button>
                )}
                {dia.mapa_geojson_id && (
                  mapasGeojson[dia.mapa_geojson_id] ? (
                    <div className="w-24 shrink-0 rounded border border-border">
                      <AvisoMapaMini geojson={mapasGeojson[dia.mapa_geojson_id]} />
                    </div>
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded border border-border bg-muted text-xs text-muted-foreground">
                      Cargando…
                    </div>
                  )
                )}
              </div>
            </div>
          ))
        )}
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
          disabled={!draft.numero.trim() || !draft.titulo.trim()}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 disabled:opacity-50"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Guardar Aviso
        </button>
      </div>
    </div>
  )
}
