"use client"

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { historicoDeEstacion, ultimos7Dias } from "@/lib/historico"
import { fmtCortoConDia } from "@/lib/fechas"
import type { Estacion } from "@/lib/types"

export function EstacionPopupChart({ estacion }: { estacion: Estacion }) {
  const dias = ultimos7Dias(historicoDeEstacion(estacion.id))

  const data = dias.map((d) => ({
    day: fmtCortoConDia(d.fecha),
    max: d.tMax,
    min: d.tMin,
  }))

  const peak = Math.max(...dias.map((d) => d.tMax))
  const low = Math.min(...dias.map((d) => d.tMin))
  const avg = Math.round(
    dias.reduce((sum, d) => sum + (d.tMax + d.tMin) / 2, 0) / dias.length
  )

  return (
    <div style={{ minWidth: 300, fontFamily: "sans-serif", fontSize: 12 }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>
        {estacion.nombre}
      </div>
      <div style={{ color: "#64748b", fontSize: 11, marginBottom: 8 }}>
        Histórico · últimos 7 días
      </div>

      <ComposedChart
        width={300}
        height={180}
        data={data}
        margin={{ top: 8, right: 8, bottom: 0, left: -18 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 10, fill: "#64748b" }}
          tickLine={false}
          axisLine={{ stroke: "#e2e8f0" }}
        />
        <YAxis
          unit="°"
          tick={{ fontSize: 10, fill: "#64748b" }}
          tickLine={false}
          axisLine={false}
          width={40}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            background: "#ffffff",
            fontSize: 12,
            color: "#0f172a",
          }}
          labelStyle={{ fontWeight: 700, color: "#0f172a" }}
          formatter={(value, name) => [
            `${typeof value === "number" ? value : ""}°C`,
            String(name ?? ""),
          ]}
        />
        <Legend iconType="plainline" wrapperStyle={{ fontSize: 11 }} />
        <Line
          type="monotone"
          dataKey="max"
          name="Máx"
          stroke="#dc2626"
          strokeWidth={2.5}
          dot={{ r: 2, fill: "#dc2626" }}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="min"
          name="Mín"
          stroke="#2563eb"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={{ r: 2, fill: "#2563eb" }}
          activeDot={{ r: 4 }}
        />
      </ComposedChart>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 8,
          color: "#475569",
          fontSize: 11,
        }}
      >
        <span>
          Máx <strong style={{ color: "#dc2626" }}>{peak}°</strong>
        </span>
        <span>
          Mín <strong style={{ color: "#2563eb" }}>{low}°</strong>
        </span>
        <span>
          Prom <strong style={{ color: "#0f172a" }}>{avg}°</strong>
        </span>
      </div>
    </div>
  )
}
