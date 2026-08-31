"use client"

import { nivelAviso, REGIONES_AVISO } from "@/lib/aviso"
import { fmtDateTimeISO, fmtFechaISO } from "@/lib/fechas"
import type { Aviso } from "@/lib/types"

export function AvisoPrint({ aviso }: { aviso: Aviso }) {
  const nivel = nivelAviso(aviso)
  const colorNivel = nivel === "Alta" ? "bg-red-600" : "bg-yellow-500"

  return (
    <div className="hidden print:block">
      {/* Encabezado */}
      <div className="flex items-start justify-between gap-4">
        <img src="/placeholder-logo.png" alt="Logo" className="w-24" />
        <div className="flex-1 text-center">
          {/*
          <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-600">
            SENAMHI · Dirección de Meteorología
          </p>
          */}
          <p className="mt-1 font-mono text-xs font-bold text-[#005cba]">
            {aviso.codigo || "—"}
          </p>
          <h1 className="text-lg font-bold uppercase leading-tight text-[#001e40]">
            {aviso.titulo || "Aviso meteorológico"}
          </h1>
        </div>
        <img src="/placeholder-logo.png" alt="Logo" className="w-24" />
      </div>

      {/* Caja de vigencia */}
      <div className="mt-4 flex justify-between gap-3 border border-neutral-300 bg-neutral-100 px-3 py-2 text-[11px] text-[#001e40]">
        <span>
          <strong>Fecha de emisión:</strong> {fmtDateTimeISO(aviso.fecha_emision)}
        </span>
        <span>
          <strong>Válido:</strong> {fmtFechaISO(aviso.valido_desde)} al{" "}
          {fmtFechaISO(aviso.valido_hasta)}
        </span>
        <span>
          <strong>Próxima actualización:</strong>{" "}
          {fmtDateTimeISO(aviso.proxima_actualizacion)}
        </span>
      </div>

      {/* Cuerpo a 2 columnas */}
      <div className="mt-4 flex gap-4">
        <div className="min-w-0 flex-1">
          {aviso.mapa_url ? (
            <img
              src={aviso.mapa_url}
              alt="Mapa del aviso"
              className="mb-2 max-h-96 w-full border border-neutral-300 object-contain"
            />
          ) : null}
          <div className="border border-neutral-300 bg-neutral-100 p-2 text-xs">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-neutral-600">
              Intensidad
            </p>
            <p className="flex items-center gap-1.5">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${colorNivel}`} />
              {nivel}
            </p>
            <p className="mb-1 mt-2 text-[10px] font-bold uppercase tracking-wide text-neutral-600">
              Probabilidad
            </p>
            <p className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-600" />A -
              Alta (&gt;60%)
            </p>
            <p className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-yellow-500" />M -
              Moderada (40-60%)
            </p>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-neutral-600">
            Perspectivas
          </p>
          {REGIONES_AVISO.map((reg) => (
            <p key={reg} className="mb-2 text-xs leading-snug">
              <strong>{reg}:</strong> {aviso.perspectivas[reg] || "—"}
            </p>
          ))}
          <div className="mt-4 border-t border-neutral-300 pt-3">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-neutral-600">
              Departamentos alertados
            </p>
            <p className="text-xs font-bold">{aviso.departamentos_alertados || "—"}</p>
          </div>
        </div>
      </div>

      {/* Tabla inferior */}
      <table className="mt-4 w-full border-collapse text-xs">
        <thead>
          <tr>
            {["Región", "Tipo de precipitación", "Máx. cantidad PP (mm/24h)", "Probabilidad", "Fenómenos asociados"].map(
              (h) => (
                <th
                  key={h}
                  className="bg-[#001e40] px-2 py-1.5 text-left text-[10px] font-bold uppercase text-white"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {REGIONES_AVISO.map((reg) => {
            const dt = aviso.detalles[reg]
            return (
              <tr key={reg} className="border-b border-neutral-300">
                <td className="px-2 py-1.5 font-bold">{reg}</td>
                <td className="px-2 py-1.5">{dt?.tipo_precipitacion || "—"}</td>
                <td className="px-2 py-1.5">{dt?.max_cantidad_pp || "—"}</td>
                <td className="px-2 py-1.5">{dt?.probabilidad || "—"}</td>
                <td className="px-2 py-1.5">{dt?.fenomenos_asociados || "—"}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Pie de página */}
      <div className="mt-6 flex items-center justify-between border-t-4 border-[#001e40] pt-2">
        <p className="text-[10px] text-neutral-600">
          Dirección de Meteorología, Clima y Ambiente admosferico - DMCA
          <br />
          Subdirección de Vigilancia Meteorológica – SVM Celular: 996369766 Telf: (01) 2658798
        </p>
{/*
        <p className="text-[10px] font-bold text-[#001e40]">
          SENAMHI1 — Servicio Nacional de Meteorología e Hidrología del Perú
        </p>
*/}
      </div>
    </div>
  )
}
