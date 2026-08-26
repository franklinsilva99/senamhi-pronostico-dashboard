"use client"

import { useState } from "react"
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

type ZoneKey = "Angamos" | "Lagunas" | "Santa Clotilde"

const zones: ZoneKey[] = ["Angamos", "Lagunas", "Santa Clotilde"]

const dataByZone: Record<ZoneKey, { day: string; max: number; min: number }[]> = {
  Angamos: [
    { day: "Sáb 25", max: 25, min: 16 },
    { day: "Dom 26", max: 24, min: 15 },
    { day: "Lun 27", max: 26, min: 17 },
    { day: "Mar 28", max: 23, min: 14 },
    { day: "Mié 29", max: 25, min: 16 },
    { day: "Jue 30", max: 27, min: 18 },
    { day: "Vie 31", max: 26, min: 17 },
  ],
  Lagunas: [
    { day: "Sáb 25", max: 18, min: 8 },
    { day: "Dom 26", max: 17, min: 7 },
    { day: "Lun 27", max: 19, min: 9 },
    { day: "Mar 28", max: 16, min: 6 },
    { day: "Mié 29", max: 18, min: 8 },
    { day: "Jue 30", max: 20, min: 10 },
    { day: "Vie 31", max: 19, min: 9 },
  ],
  "Santa Clotilde": [
    { day: "Sáb 25", max: 31, min: 22 },
    { day: "Dom 26", max: 30, min: 21 },
    { day: "Lun 27", max: 32, min: 23 },
    { day: "Mar 28", max: 29, min: 20 },
    { day: "Mié 29", max: 31, min: 22 },
    { day: "Jue 30", max: 33, min: 24 },
    { day: "Vie 31", max: 32, min: 23 },
  ],
}

const stats = (rows: { max: number; min: number }[]) => {
  const maxes = rows.map((r) => r.max)
  const mins = rows.map((r) => r.min)
  return {
    peak: Math.max(...maxes),
    low: Math.min(...mins),
    avg: Math.round(rows.reduce((s, r) => s + (r.max + r.min) / 2, 0) / rows.length),
  }
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: "warm" | "cool" | "neutral" }) {
  const toneClass =
    tone === "warm"
      ? "text-[var(--process-foreground)]"
      : tone === "cool"
        ? "text-primary"
        : "text-foreground"
  return (
    <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${toneClass}`}>{value}</p>
    </div>
  )
}

export function ForecastChart() {
  const [zone, setZone] = useState<ZoneKey>("Angamos")
  const data = dataByZone[zone]
  const s = stats(data)

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-foreground">Evolución de temperatura</h2>
          <p className="text-xs text-muted-foreground">Máximas y mínimas pronosticadas por día</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          {zones.map((z) => (
            <button
              key={z}
              type="button"
              onClick={() => setZone(z)}
              aria-current={zone === z ? "true" : undefined}
              className={`rounded-md px-3 py-1 text-[11px] font-semibold transition-colors ${
                zone === z
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {z}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Máx. pico" value={`${s.peak}°`} tone="warm" />
        <StatCard label="Mín. absoluta" value={`${s.low}°`} tone="cool" />
        <StatCard label="Promedio" value={`${s.avg}°`} tone="neutral" />
      </div>

      <div className="min-h-0 flex-1 rounded-lg border border-border bg-card p-3">
        <ResponsiveContainer width="100%" height="100%" minHeight={280}>
          <ComposedChart data={data} margin={{ top: 12, right: 12, bottom: 4, left: -12 }}>
            <defs>
              <linearGradient id="fillMax" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--process)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--process)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillMin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
            />
            <YAxis
              unit="°"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              width={44}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--card)",
                fontSize: 12,
                color: "var(--foreground)",
              }}
              labelStyle={{ fontWeight: 700, color: "var(--foreground)" }}
              formatter={(value: number, name) => [`${value}°C`, name === "max" ? "Máxima" : "Mínima"]}
            />
            <Legend
              iconType="plainline"
              wrapperStyle={{ fontSize: 11 }}
              formatter={(value) => (value === "max" ? "Máxima" : "Mínima")}
            />
            <Area type="monotone" dataKey="max" stroke="none" fill="url(#fillMax)" />
            <Area type="monotone" dataKey="min" stroke="none" fill="url(#fillMin)" />
            <Line
              type="monotone"
              dataKey="max"
              stroke="var(--process)"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "var(--process)" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="min"
              stroke="var(--primary)"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "var(--primary)" }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
