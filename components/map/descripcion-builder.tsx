"use client"

import { useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { CheckCircle2, SpellCheck, X } from "lucide-react"
import {
  CATEGORIAS,
  CONECTORES,
  VOCABULARIO,
  componerDescripcion,
  filaVacia,
  validarDescripcion,
  type FilaDescripcion,
} from "@/lib/vocabulario"

const inputCls =
  "w-full rounded-md border border-input bg-card px-2.5 py-1.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"

export function DescripcionBuilder({
  titulo,
  onCancelar,
  onGuardar,
}: {
  titulo: string
  onCancelar: () => void
  onGuardar: (texto: string, copiarTodos: boolean) => void
}) {
  const [filas, setFilas] = useState<FilaDescripcion[]>([
    filaVacia(),
    filaVacia(),
    filaVacia(),
  ])
  const [textoFinal, setTextoFinal] = useState("")
  const [copiarTodos, setCopiarTodos] = useState(false)
  const [resultado, setResultado] = useState<{
    valida: boolean
    errores: string[]
  } | null>(null)

  const descripcion = useMemo(
    () => componerDescripcion(filas, textoFinal),
    [filas, textoFinal]
  )

  const setFila = <K extends keyof FilaDescripcion>(
    i: number,
    key: K,
    value: FilaDescripcion[K]
  ) =>
    setFilas((f) =>
      f.map((fila, idx) => (idx === i ? { ...fila, [key]: value } : fila))
    )

  const validar = () => setResultado(validarDescripcion(filas, textoFinal))

  const guardar = () => onGuardar(descripcion, copiarTodos)

  return createPortal(
    <div className="fixed inset-0 z-[1100] flex items-center justify-center">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCancelar}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative z-10 flex max-h-[85vh] w-[560px] max-w-[95vw] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Codificación de pronóstico
            </h3>
            <p className="text-[11px] text-muted-foreground">{titulo}</p>
          </div>
          <button
            type="button"
            onClick={onCancelar}
            aria-label="Cerrar"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {filas.map((fila, i) => (
            <div key={i} className="rounded-md border border-border/70 p-2">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Fila {i + 1}
              </p>
              <select
                value={fila.opcion}
                onChange={(e) => setFila(i, "opcion", e.target.value)}
                className={inputCls}
              >
                <option value="">— Sin frase —</option>
                {CATEGORIAS.map((cat) => (
                  <optgroup key={cat} label={cat}>
                    {VOCABULARIO.filter((o) => o.categoria === cat).map((o) => (
                      <option key={o.codigo} value={o.codigo}>
                        {o.texto}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <input
                type="text"
                value={fila.condicion}
                onChange={(e) => setFila(i, "condicion", e.target.value)}
                placeholder="Condición (ej. por la tarde, con ráfagas…)"
                className={`${inputCls} mt-1.5`}
              />

              <select
                value={fila.conector}
                onChange={(e) => setFila(i, "conector", e.target.value)}
                className={`${inputCls} mt-1.5`}
              >
                <option value="">— Sin conector —</option>
                {CONECTORES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Texto final
            </label>
            <textarea
              rows={2}
              value={textoFinal}
              onChange={(e) => setTextoFinal(e.target.value)}
              placeholder="Completar la descripción…"
              className={inputCls}
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-foreground">
            <input
              type="checkbox"
              checked={copiarTodos}
              onChange={(e) => setCopiarTodos(e.target.checked)}
              className="h-3.5 w-3.5"
            />
            Copiar descripción a todos los días
          </label>

          <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Vista previa
            </p>
            <p className="text-xs leading-relaxed text-foreground">
              {descripcion || (
                <span className="italic text-muted-foreground">
                  La descripción aparecerá aquí…
                </span>
              )}
            </p>
          </div>

          {resultado && (
            <div
              className={`rounded-md border px-3 py-2 text-xs ${
                resultado.valida
                  ? "border-green-300 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300"
                  : "border-destructive/40 bg-destructive/5 text-destructive"
              }`}
            >
              {resultado.valida ? (
                <span className="inline-flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Descripción válida.
                </span>
              ) : (
                <ul className="list-inside list-disc space-y-1">
                  {resultado.errores.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-4 py-3">
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={validar}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
          >
            <SpellCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Validar
          </button>
          <button
            type="button"
            onClick={guardar}
            className="inline-flex items-center gap-1.5 rounded-md bg-forecast px-3 py-1.5 text-xs font-semibold text-forecast-foreground transition-colors hover:opacity-90"
          >
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Guardar
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
