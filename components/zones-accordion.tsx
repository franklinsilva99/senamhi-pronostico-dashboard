"use client"

import { useState } from "react"
import { Minus, Plus, Eye, EyeOff, MoreHorizontal, Pencil } from "lucide-react"

const zone1Dates = [
  "Sáb 25 de agosto del 2026",
  "Dom 26 de agosto del 2026",
  "Lun 27 de agosto del 2026",
]

function Toggle({ id }: { id: string }) {
  const [on, setOn] = useState(true)
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      aria-pressed={on}
      aria-label={`Visibilidad ${id}`}
      className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
        on
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-muted text-muted-foreground"
      }`}
    >
      {on ? (
        <Eye className="h-4 w-4" aria-hidden="true" />
      ) : (
        <EyeOff className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  )
}

function DateRow({ date, index }: { date: string; index: number }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border/70 py-3 last:border-b-0">
      <span className="w-48 shrink-0 text-sm text-foreground">{date}</span>

      <div className="flex items-center gap-2">
        <input
          type="text"
          defaultValue="18"
          aria-label={`Temp. mínima ${date}`}
          className="w-14 rounded-md border border-input bg-card px-2 py-1.5 text-center text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
        <input
          type="text"
          defaultValue="27"
          aria-label={`Temp. máxima ${date}`}
          className="w-14 rounded-md border border-input bg-card px-2 py-1.5 text-center text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
      </div>

      <input
        type="text"
        placeholder="Descripción del pronóstico…"
        aria-label={`Descripción ${date}`}
        className="min-w-40 flex-1 rounded-md border border-input bg-card px-3 py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
      />

      <Toggle id={`${index}`} />

      <button
        type="button"
        aria-label="Más opciones"
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}

function ZoneHeader({
  title,
  hint,
  open,
  onToggle,
}: {
  title: string
  hint: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="flex w-full items-center justify-between rounded-lg bg-accent px-4 py-3 text-left transition-colors hover:bg-accent/80"
    >
      <span className="text-sm font-semibold text-accent-foreground">
        {title}{" "}
        <span className="font-normal italic text-muted-foreground">{hint}</span>
      </span>
      {open ? (
        <Minus className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
      ) : (
        <Plus className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
      )}
    </button>
  )
}

export function ZonesAccordion() {
  const [open, setOpen] = useState<{ z1: boolean; z2: boolean }>({
    z1: true,
    z2: false,
  })

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-4 flex justify-start">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          EDITAR
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {/* Zona 1 — expandida */}
        <div className="rounded-xl border border-border">
          <div className="p-2">
            <ZoneHeader
              title="Zona 1"
              hint="(Ej. Angamos)"
              open={open.z1}
              onToggle={() => setOpen((s) => ({ ...s, z1: !s.z1 }))}
            />
          </div>
          {open.z1 && (
            <div className="px-4 pb-4">
              <p className="mb-1 text-sm font-semibold text-foreground">
                Angamos
              </p>
              <div className="flex flex-col">
                {zone1Dates.map((d, i) => (
                  <DateRow key={d} date={d} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Zona 2 — colapsada */}
        <div className="rounded-xl border border-border">
          <div className="p-2">
            <ZoneHeader
              title="Zona 2"
              hint="(Ej. Lagunas)"
              open={open.z2}
              onToggle={() => setOpen((s) => ({ ...s, z2: !s.z2 }))}
            />
          </div>
          {open.z2 && (
            <div className="px-4 pb-4">
              <p className="mb-1 text-sm font-semibold text-foreground">
                Lagunas
              </p>
              <div className="flex flex-col">
                {zone1Dates.map((d, i) => (
                  <DateRow key={d} date={d} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
