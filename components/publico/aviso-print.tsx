"use client"

import { NIVEL_COLOR, duracionHoras } from "@/lib/aviso"
import { fmtDateTimeISO, fmtFechaISO, fechaLargaCorta } from "@/lib/fechas"
import type { Aviso } from "@/lib/types"
import { AvisoMapaPrint } from "@/components/publico/aviso-mapa-print"

export function AvisoPrint({
  aviso,
  mapas,
}: {
  aviso: Aviso
  mapas?: Record<string, unknown>
}) {
  const horas = duracionHoras(aviso.inicio_evento, aviso.fin_evento)

  return (
    <div className="hidden print:block">
      {/* Encabezado */}
      <div className="flex items-start justify-between gap-4">
        <img src="/placeholder-logo.png" alt="Logo" className="w-24" />
        <div className="flex-1 text-center">
          <p className="font-mono text-xs font-bold text-[#005cba]">
            AVISO METEOROLÓGICO N° {aviso.numero || "—"} · {aviso.codigo || ""}
          </p>
          <h1 className="text-lg font-bold uppercase leading-tight text-[#001e40]">
            {aviso.titulo || "Aviso meteorológico"}
          </h1>
          <span
            className={`mt-1 inline-block rounded px-3 py-0.5 text-xs font-bold ${NIVEL_COLOR[aviso.nivel].banner}`}
          >
            NIVEL {aviso.nivel}
          </span>
        </div>
        <img src="/placeholder-logo.png" alt="Logo" className="w-24" />
      </div>

      {/* Caja de vigencia */}
      <div className="mt-4 flex justify-between gap-3 border border-neutral-300 bg-neutral-100 px-3 py-2 text-[11px] text-[#001e40]">
        <span>
          <strong>Fecha de emisión:</strong> {fmtDateTimeISO(aviso.fecha_emision)}
        </span>
        <span>
          <strong>Inicio del evento:</strong> {fmtDateTimeISO(aviso.inicio_evento)}
        </span>
        <span>
          <strong>Fin del evento:</strong> {fmtDateTimeISO(aviso.fin_evento)}
        </span>
        <span>
          <strong>Vigencia:</strong> {horas != null ? `${horas} horas` : "—"}
        </span>
      </div>

      {/* Cuerpo narrativo */}
      {aviso.cuerpo && (
        <p className="mt-4 whitespace-pre-line text-xs leading-relaxed text-[#001e40]">
          {aviso.cuerpo}
        </p>
      )}

      {/* Pronóstico por día */}
      <div className="mt-4 space-y-3">
        {aviso.dias.map((dia) => (
          <div key={dia.id} className="break-inside-avoid">
            <p className="text-xs font-bold text-[#001e40]">
              {dia.fecha ? fechaLargaCorta(dia.fecha) : "—"}
            </p>
            <div className="mt-2 flex items-start gap-4">
              <div className="flex min-w-0 flex-1 justify-center">
                {dia.mapa_url ? (
                  <img
                    src={dia.mapa_url}
                    alt={`Mapa ${dia.fecha}`}
                    className="max-h-[420px] w-auto max-w-full border border-neutral-300 object-contain"
                  />
                ) : dia.mapa_geojson_id && mapas?.[dia.mapa_geojson_id] ? (
                  <AvisoMapaPrint
                    geojson={mapas[dia.mapa_geojson_id]}
                    maxHeight={420}
                  />
                ) : null}
              </div>
              {dia.descripcion && (
                <div className="w-[42%] shrink-0">
                  <p className="whitespace-pre-line text-xs leading-snug text-[#001e40]">
                    {dia.descripcion}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Departamentos */}
      <div className="mt-4 border-t border-neutral-300 pt-3">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-neutral-600">
          Departamentos alertados
        </p>
        <p className="text-xs font-bold">{aviso.departamentos || "—"}</p>
      </div>

      {/* Pie de página */}
      <div className="mt-6 flex items-center justify-between border-t-4 border-[#001e40] pt-2">
        <p className="text-[10px] text-neutral-600">
          Dirección de Meteorología, Clima y Ambiente admosferico - DMCA
          <br />
          Subdirección de Vigilancia Meteorológica – SVM Celular: 996369766 Telf: (01) 2658798
        </p>
      </div>
    </div>
  )
}
