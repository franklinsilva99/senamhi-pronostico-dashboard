import { Calendar, ChevronDown } from "lucide-react"

function SelectField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="flex min-w-24 items-center justify-between gap-2 rounded-lg border border-input bg-card px-3 py-1.5 text-sm text-foreground shadow-sm">
        <span>{value}</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
      </div>
    </label>
  )
}

export function MapHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card px-8 py-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-muted-foreground">
          Fecha de Inicio:
        </span>
        <div className="flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm">
          <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
          15/08/2026
        </div>
      </div>

      <div className="flex items-center gap-4">
        <SelectField label="Sector" value="1" />
        <SelectField label="Zona" value="Todos" />
      </div>
    </header>
  )
}
