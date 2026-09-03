"use client"

import { NIVEL_COLOR, duracionHoras } from "@/lib/aviso"
import { fmtDateTimeISO, fmtFechaISO, fechaLargaCorta } from "@/lib/fechas"
import { departamentosAfectados } from "@/lib/geo"
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

  const deptos = new Set<string>()
  for (const dia of aviso.dias) {
    const geojson = dia.mapa_geojson_id ? mapas?.[dia.mapa_geojson_id] : undefined
    if (geojson) {
      for (const d of departamentosAfectados(geojson)) deptos.add(d)
    }
  }
  const listaDeptos = Array.from(deptos).sort()
  const textoDeptos =
    listaDeptos.length > 0 ? listaDeptos.join(", ") : aviso.departamentos || "—"

  return (
    <div className="hidden print:block">
      {/* Encabezado */}
      <div className="flex items-start justify-between gap-4">
        <img src="/senamhi-logo.png" alt="SENAMHI" className="h-12 w-auto" />
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
        <img src="/senamhi-logo.png" alt="SENAMHI" className="h-12 w-auto" />
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
      <div className="mt-4 grid grid-cols-2 gap-4">
        {aviso.dias.map((dia) => (
          <div key={dia.id} className="break-inside-avoid">
            <p className="text-xs font-bold text-[#001e40]">
              {dia.fecha ? fechaLargaCorta(dia.fecha) : "—"}
            </p>
            {dia.descripcion && (
              <p className="mt-1 whitespace-pre-line text-xs leading-snug text-[#001e40]">
                {dia.descripcion}
              </p>
            )}
            <div className="mt-2 flex justify-center">
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
          </div>
        ))}
      </div>

      {/* Departamentos */}
      <div className="mt-4 border-t border-neutral-300 pt-3">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-neutral-600">
          Departamentos alertados
        </p>
        <p className="text-xs font-bold">{textoDeptos}</p>
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
