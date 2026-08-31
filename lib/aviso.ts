import type { Aviso, RegionAviso } from "@/lib/types"

export const REGIONES_AVISO: RegionAviso[] = ["SELVA", "SIERRA", "COSTA"]

export function nivelAviso(a: Aviso): "Alta" | "Moderada" {
  for (const reg of REGIONES_AVISO) {
    if (a.detalles[reg]?.probabilidad === "A") return "Alta"
  }
  return "Moderada"
}

function detalleVacio() {
  return {
    tipo_precipitacion: "",
    max_cantidad_pp: "",
    probabilidad: "M" as const,
    fenomenos_asociados: "",
  }
}

export function avisoVacio(): Aviso {
  const ahora = new Date()
  const desde = new Date(ahora)
  const hasta = new Date(ahora.getTime() + 24 * 60 * 60 * 1000)
  return {
    id: "",
    codigo: "",
    titulo: "",
    evento: "",
    sede: "SEDE CENTRAL",
    responsable: "",
    fecha_emision: aISO(ahora),
    valido_desde: aISO(desde),
    valido_hasta: aISO(hasta),
    proxima_actualizacion: aISO(ahora),
    departamentos_alertados: "",
    estado: "Cargado",
    mapa_url: "",
    perspectivas: { SELVA: "", SIERRA: "", COSTA: "" },
    detalles: {
      SELVA: detalleVacio(),
      SIERRA: detalleVacio(),
      COSTA: detalleVacio(),
    },
  }
}

function aISO(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(
    d.getHours()
  )}:${p(d.getMinutes())}`
}
