import { Eye, MoreHorizontal } from "lucide-react"

type Row = { date: string }
type ZoneGroup = { zone: string; rows: Row[] }

const groups: ZoneGroup[] = [
  {
    zone: "Angamos",
    rows: [
      { date: "Sáb 25 de agosto del 2026" },
      { date: "Sáb 26 de agosto del 2026" },
      { date: "Sáb 27 de agosto del 2026" },
    ],
  },
  {
    zone: "Lagunas",
    rows: [
      { date: "Sáb 25 de agosto del 2026" },
      { date: "Sáb 26 de agosto del 2026" },
      { date: "Sáb 27 de agosto del 2026" },
    ],
  },
  {
    zone: "Santa Clotilde",
    rows: [
      { date: "Sáb 25 de agosto del 2026" },
      { date: "Sáb 26 de agosto del 2026" },
      { date: "Sáb 27 de agosto del 2026" },
    ],
  },
]

function ForecastRow({ date }: Row) {
  return (
    <div className="flex items-center gap-2 py-1.5 pl-4 pr-1">
      <span className="w-40 shrink-0 text-[11px] text-muted-foreground">{date}</span>

      <input
        aria-label={`Temperatura máxima ${date}`}
        defaultValue="25"
        className="h-6 w-9 rounded border border-input bg-card text-center text-[11px] text-foreground outline-none focus:border-ring"
      />
      <input
        aria-label={`Temperatura mínima ${date}`}
        defaultValue="16"
        className="h-6 w-9 rounded border border-input bg-card text-center text-[11px] text-foreground outline-none focus:border-ring"
      />

      <div className="flex h-6 flex-1 items-center rounded-full border border-input bg-muted px-3 text-[11px] text-muted-foreground">
        Cielo con nubes dispersas…
      </div>

      <button
        type="button"
        aria-label="Ver detalle"
        className="flex h-6 w-7 items-center justify-center rounded-full border border-input bg-card text-primary hover:bg-accent"
      >
        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Más opciones"
        className="flex h-6 w-6 items-center justify-center rounded border border-input bg-card text-muted-foreground hover:bg-accent"
      >
        <MoreHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}

export function ForecastPanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center border-b border-border pb-2">
        <p className="flex-1 pl-4 text-xs font-bold text-foreground">
          Pronóstico para los días
        </p>
        <div className="flex shrink-0 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          <span className="w-9">Máx</span>
          <span className="w-9">Mín</span>
        </div>
        <span className="w-[132px] pl-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Condición / descripción
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {groups.map((g) => (
          <div key={g.zone} className="border-b border-border/70">
            <div className="bg-accent/60 px-4 py-1.5 text-[11px] font-semibold text-accent-foreground">
              {g.zone}
            </div>
            {g.rows.map((r, i) => (
              <ForecastRow key={i} date={r.date} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
