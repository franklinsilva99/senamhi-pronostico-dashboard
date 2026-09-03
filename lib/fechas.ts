import type { DiaEstado, Pronostico, Ronda, Zona } from "@/lib/types"

const DIAS_CORTO = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
const DIAS_LARGO = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
]
const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
]

export function toISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function fromISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function addDaysISO(iso: string, n: number): string {
  const d = fromISO(iso)
  d.setDate(d.getDate() + n)
  return toISO(d)
}

export function nombreDiaCorto(iso: string): string {
  return DIAS_CORTO[fromISO(iso).getDay()]
}

export function nombreDiaLargo(iso: string): string {
  const d = fromISO(iso)
  return `${DIAS_LARGO[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]} del ${d.getFullYear()}`
}

export function fmtCortoConDia(iso: string): string {
  const d = fromISO(iso)
  return `${DIAS_CORTO[d.getDay()]} ${d.getDate()}`
}

export function fechaLargaCorta(iso: string): string {
  const d = fromISO(iso)
  return `${DIAS_CORTO[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]} del ${d.getFullYear()}`
}

export function fmtDiaMes(iso: string): string {
  if (!iso) return "—"
  const d = fromISO(iso)
  const mes = MESES[d.getMonth()]
  return `${d.getDate()} de ${mes.charAt(0).toUpperCase()}${mes.slice(1)}`
}

export function fmtFechaCompleta(iso: string): string {
  if (!iso) return "—"
  const d = fromISO(iso)
  const dia = DIAS_LARGO[d.getDay()]
  const diaCap = dia.charAt(0).toUpperCase() + dia.slice(1)
  const mes = MESES[d.getMonth()]
  const mesCap = mes.charAt(0).toUpperCase() + mes.slice(1)
  return `${diaCap}, ${String(d.getDate()).padStart(2, "0")} de ${mesCap} de ${d.getFullYear()}`
}

export function fmtFechaEvento(iso: string): string {
  if (!iso) return "—"
  const [fecha, hora] = iso.split("T")
  const d = fromISO(fecha)
  const [hh, mm] = (hora ?? "00:00").slice(0, 5).split(":")
  return `${DIAS_LARGO[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()} a las ${hh}:${mm} horas`
}

export function fmtDDMMYYYY(iso: string): string {
  const [y, m, d] = iso.split("-")
  return `${d}/${m}/${y}`
}

export function fmtFechaISO(iso: string): string {
  if (!iso) return "—"
  const [fecha] = iso.split("T")
  const [y, m, d] = fecha.split("-")
  return `${d}/${m}/${y}`
}

export function fmtDateTimeISO(iso: string): string {
  if (!iso) return "—"
  const [fecha, hora] = iso.split("T")
  const [y, m, d] = fecha.split("-")
  const hhmm = (hora ?? "00:00").slice(0, 5)
  return `${d}/${m}/${y} ${hhmm}`
}

export function fmtRangoLargo(inicio: string, fin: string): string {
  return `${nombreDiaLargo(inicio)} – ${nombreDiaLargo(fin)}`
}

export function fmtRangoConAnio(inicio: string, fin: string): string {
  const a = fromISO(inicio)
  const b = fromISO(fin)
  const ini = `${DIAS_CORTO[a.getDay()]} ${a.getDate()}`
  const finCorto = `${DIAS_CORTO[b.getDay()]} ${b.getDate()}`
  if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()) {
    return `${ini} – ${finCorto} de ${MESES[a.getMonth()]} del ${a.getFullYear()}`
  }
  const iniFull = `${ini} de ${MESES[a.getMonth()]} del ${a.getFullYear()}`
  const finFull = `${finCorto} de ${MESES[b.getMonth()]} del ${b.getFullYear()}`
  return `${iniFull} – ${finFull}`
}

export function fmtTituloRango(inicio: string, fin: string): string {
  const a = fromISO(inicio)
  const b = fromISO(fin)
  if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()) {
    return `${a.getDate()} – ${b.getDate()} de ${MESES[a.getMonth()]} ${a.getFullYear()}`
  }
  const ini = `${a.getDate()} de ${MESES[a.getMonth()]}`
  const finPart = `${b.getDate()} de ${MESES[b.getMonth()]}`
  if (a.getFullYear() === b.getFullYear()) {
    return `${ini} – ${finPart} ${b.getFullYear()}`
  }
  return `${ini} ${a.getFullYear()} – ${finPart} ${b.getFullYear()}`
}

export function diasBloque(inicioISO: string, n = 3): string[] {
  return Array.from({ length: n }, (_, i) => addDaysISO(inicioISO, i))
}

export function rangoFechas(inicio: string, fin: string): string[] {
  const fechas: string[] = []
  let cursor = inicio
  while (cursor <= fin) {
    fechas.push(cursor)
    cursor = addDaysISO(cursor, 1)
  }
  return fechas
}

export function entre(fecha: string, inicio: string, fin: string): boolean {
  return fecha >= inicio && fecha <= fin
}

export function estadoDiaSector(
  fecha: string,
  sectorId: string,
  zonas: Zona[],
  rondas: Ronda[],
  pronosticos: Pronostico[]
): DiaEstado {
  const zonasSector = zonas.filter((z) => z.sectorId === sectorId)
  const rondasSector = rondas.filter((r) => r.sectorId === sectorId)
  const rondasCubren = rondasSector.filter((r) => entre(fecha, r.inicio, r.fin))

  if (rondasCubren.length === 0) return "noforecast"

  const completa = rondasCubren.some((r) => {
    const zonasConProno = new Set(
      pronosticos.filter((p) => p.rondaId === r.id).map((p) => p.zonaId)
    )
    return zonasSector.every((z) => zonasConProno.has(z.id))
  })

  return completa ? "forecast" : "process"
}

export function rondaCompleta(
  rondaId: string,
  zonas: Zona[],
  pronosticos: Pronostico[]
): boolean {
  const zonasConProno = new Set(
    pronosticos.filter((p) => p.rondaId === rondaId).map((p) => p.zonaId)
  )
  return zonas.every((z) => zonasConProno.has(z.id))
}
