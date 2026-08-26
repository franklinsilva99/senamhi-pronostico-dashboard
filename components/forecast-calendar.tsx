type DayState = "forecast" | "process" | "noforecast" | "empty"

type Day = {
  n: number
  weekday: string
  state: DayState
}

const days: Day[] = [
  { n: 22, weekday: "Lun", state: "forecast" },
  { n: 23, weekday: "Mar", state: "forecast" },
  { n: 24, weekday: "Mié", state: "forecast" },
  { n: 25, weekday: "Jue", state: "process" },
  { n: 26, weekday: "Vie", state: "noforecast" },
  { n: 27, weekday: "Sáb", state: "noforecast" },
]

const stateStyles: Record<DayState, string> = {
  forecast:
    "texture-forecast border-forecast text-forecast-foreground",
  process:
    "bg-process/40 border-process text-process-foreground",
  noforecast:
    "texture-noforecast border-noforecast text-noforecast-foreground",
  empty: "border-border bg-card text-muted-foreground",
}

const legend = [
  { label: "PRONOSTICADO", color: "bg-forecast" },
  { label: "EN PROCESO", color: "bg-process" },
  { label: "SIN PRONÓSTICO", color: "bg-noforecast" },
]

export function ForecastCalendar() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        {/* Fila superior: año / semana */}
        <div className="flex items-center justify-between rounded-lg bg-accent px-3 py-2">
          <span className="text-sm font-semibold text-accent-foreground">
            Agosto 2026
          </span>
          <div className="flex items-center gap-1.5">
            {[2, 3, 4, 5, 6, 7, 8].map((w) => (
              <span
                key={w}
                className="flex h-6 w-6 items-center justify-center rounded-md bg-card text-xs font-medium text-muted-foreground"
              >
                {w}
              </span>
            ))}
          </div>
        </div>

        {/* Fila intermedia: días con estado */}
        <div className="mt-3 grid grid-cols-6 gap-2">
          {days.map((d) => (
            <div
              key={d.n}
              className={`flex flex-col items-center rounded-lg border py-2 ${stateStyles[d.state]}`}
            >
              <span className="text-[11px] font-medium uppercase opacity-70">
                {d.weekday}
              </span>
              <span className="text-lg font-bold leading-tight">{d.n}</span>
            </div>
          ))}
        </div>

        {/* Fila inferior */}
        <div className="mt-2 grid grid-cols-6 gap-2">
          {days.map((d) => (
            <div
              key={d.n}
              className="h-7 rounded-lg border border-dashed border-border bg-muted/40"
            />
          ))}
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex flex-col justify-center gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-sm">
        {legend.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-3">
            <span
              className={`h-4 w-4 shrink-0 rounded-full ${color}`}
              aria-hidden="true"
            />
            <span className="text-xs font-semibold tracking-wide text-foreground">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
