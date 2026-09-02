"use client"

import { Fragment, useState } from "react"
import { useStore } from "@/lib/store"
import { historicoDeEstacion, ultimosDias } from "@/lib/historico"
import { fmtCortoConDia } from "@/lib/fechas"
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

const PALETA = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#d97706",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#65a30d",
  "#ca8a04",
  "#0f766e",
]

type Fila = {
  day: string
  [key: string]: string | number
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: "warm" | "cool" | "neutral" }) {
  const toneClass =
    tone === "warm"
      ? "text-[var(--process-foreground)]"
      : tone === "cool"
        ? "text-primary"
        : "text-foreground"
  return (
    <div className="rounded-lg border border-border bg-secondary/40 px-2.5 py-1.5">
      <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-0.5 text-base font-bold tabular-nums ${toneClass}`}>{value}</p>
    </div>
  )
}

export function ForecastChart({ zonaFiltro }: { zonaFiltro: string }) {
  const { state } = useStore()
  const [diasN, setDiasN] = useState(7)

  const zona = state.zonas.find((z) => z.id === zonaFiltro)
  const estaciones = state.estaciones.filter((e) => e.zonaId === zonaFiltro)

  if (!zona || zonaFiltro === "todos") {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center text-xs italic text-muted-foreground">
        Selecciona una zona para ver la comparativa histórica de sus estaciones.
      </div>
    )
  }

  if (estaciones.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center text-xs italic text-muted-foreground">
        Esta zona no tiene estaciones meteorológicas.
      </div>
    )
  }

  const series = estaciones.map((e) => ({
    estacion: e,
    dias: ultimosDias(historicoDeEstacion(e.id), diasN),
  }))

  const dias = series[0].dias.map((d) => d.fecha)

  const data: Fila[] = dias.map((fecha, i) => {
    const fila: Fila = { day: fmtCortoConDia(fecha) }
    for (const { estacion, dias: ds } of series) {
      fila[`max_${estacion.id}`] = ds[i].tMax
      fila[`min_${estacion.id}`] = ds[i].tMin
    }
    return fila
  })

  const todosMax = series.flatMap((s) => s.dias.map((d) => d.tMax))
  const todosMin = series.flatMap((s) => s.dias.map((d) => d.tMin))
  const stats = {
    peak: Math.max(...todosMax),
    low: Math.min(...todosMin),
    avg: Math.round(
      series
        .flatMap((s) => s.dias)
        .reduce((sum, d) => sum + (d.tMax + d.tMin) / 2, 0) /
        (series.reduce((n, s) => n + s.dias.length, 0) || 1)
    ),
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-foreground">
            Comparativa histórica · {zona.nombre}
          </h2>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5">
            {[7, 14, 30].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setDiasN(n)}
                aria-pressed={diasN === n}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                  diasN === n
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {n} días
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Temperaturas máximas y mínimas registradas por las estaciones (últimos {diasN} días)
        </p>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        <StatCard label="Máx. pico" value={`${stats.peak}°`} tone="warm" />
        <StatCard label="Mín. absoluta" value={`${stats.low}°`} tone="cool" />
        <StatCard label="Promedio" value={`${stats.avg}°`} tone="neutral" />
      </div>

      <div className="min-h-0 flex-1 rounded-lg border border-border bg-card p-3">
        <ResponsiveContainer width="100%" height="100%" minHeight={280}>
          <ComposedChart data={data} margin={{ top: 12, right: 12, bottom: 4, left: -12 }}>
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
              formatter={(value, name) => [
                `${typeof value === "number" ? value : ""}°C`,
                String(name ?? ""),
              ]}
            />
            <Legend iconType="plainline" wrapperStyle={{ fontSize: 11 }} />
            {series.map(({ estacion }, idx) => {
              const color = PALETA[idx % PALETA.length]
              return (
                <Fragment key={estacion.id}>
                  <Line
                    type="monotone"
                    dataKey={`max_${estacion.id}`}
                    name={`${estacion.nombre} · Máx`}
                    stroke={color}
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: color }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey={`min_${estacion.id}`}
                    name={`${estacion.nombre} · Mín`}
                    stroke={color}
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 2.5, fill: color }}
                    activeDot={{ r: 4 }}
                  />
                </Fragment>
              )
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
