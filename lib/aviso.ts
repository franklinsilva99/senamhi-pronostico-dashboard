import type { Aviso, DiaAviso, NivelAviso } from "@/lib/types"

export const NIVELES_AVISO: NivelAviso[] = ["ROJO", "NARANJA", "AMARILLO"]

export const NIVEL_COLOR: Record<
  NivelAviso,
  { badge: string; dot: string; banner: string; text: string }
> = {
  ROJO: {
    badge: "bg-red-600 text-white border-red-700",
    dot: "bg-red-600",
    banner: "bg-red-600 text-white",
    text: "text-red-600",
  },
  NARANJA: {
    badge: "bg-orange-500 text-white border-orange-600",
    dot: "bg-orange-500",
    banner: "bg-orange-500 text-white",
    text: "text-orange-500",
  },
  AMARILLO: {
    badge: "bg-yellow-400 text-yellow-950 border-yellow-500",
    dot: "bg-yellow-400",
    banner: "bg-yellow-400 text-yellow-950",
    text: "text-yellow-600",
  },
}

export function duracionHoras(inicio: string, fin: string): number | null {
  if (!inicio || !fin) return null
  const a = new Date(inicio).getTime()
  const b = new Date(fin).getTime()
  if (Number.isNaN(a) || Number.isNaN(b) || b <= a) return null
  return Math.round((b - a) / (60 * 60 * 1000))
}

export function diaVacio(fecha = ""): DiaAviso {
  return { id: "", fecha, descripcion: "", mapa_url: "" }
}

export function avisoVacio(): Aviso {
  const ahora = new Date()
  const desde = new Date(ahora)
  const hasta = new Date(ahora.getTime() + 24 * 60 * 60 * 1000)
  return {
    id: "",
    numero: "",
    codigo: "",
    nivel: "NARANJA",
    titulo: "",
    fecha_emision: aISO(ahora),
    inicio_evento: aISO(desde),
    fin_evento: aISO(hasta),
    departamentos: "",
    cuerpo: "",
    dias: [],
    estado: "Cargado",
  }
}

function aISO(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(
    d.getHours()
  )}:${p(d.getMinutes())}`
}
