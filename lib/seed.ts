import type {
  AppState,
  Aviso,
  DiaPronostico,
  Estacion,
  Pronostico,
  Ronda,
  Sector,
  Zona,
} from "@/lib/types"
import { addDaysISO } from "@/lib/fechas"
import { PROVINCIAS } from "@/lib/geo"
import estacionesData from "@/lib/data/estaciones.json"

export const HOY = "2026-08-26"
export const SEMANA_ACTIVA = { inicio: "2026-08-22", fin: "2026-08-28" }

const TILDES: Record<string, string> = {
  ANCASH: "Áncash",
  APURIMAC: "Apurímac",
  HUANUCO: "Huánuco",
  JUNIN: "Junín",
  MARTIN: "Martín",
  RAMON: "Ramón",
  MARAÑON: "Marañón",
  JAEN: "Jaén",
  BONGARA: "Bongará",
  RODRIGUEZ: "Rodríguez",
  CONTUMAZA: "Contumazá",
  CELENDIN: "Celendín",
  ASUNCION: "Asunción",
  FERMIN: "Fermín",
  CAMANA: "Camaná",
  CARAVELI: "Caravelí",
  UNION: "Unión",
  PAUCAR: "Páucar",
  VICTOR: "Víctor",
  HUAMAN: "Huamán",
  CONVENCION: "Convención",
  HUAYTARA: "Huaytará",
  HUAMALIES: "Huamalíes",
  CONCEPCION: "Concepción",
  BOLIVAR: "Bolívar",
  CHEPEN: "Chepén",
  JULCAN: "Julcán",
  SANCHEZ: "Sánchez",
  CARRION: "Carrión",
  CHIMU: "Chimú",
  VIRU: "Virú",
  CAÑETE: "Cañete",
  FERREÑAFE: "Ferreñafe",
  HUAROCHIRI: "Huarochirí",
  OYON: "Oyón",
  AZANGARO: "Azángaro",
  HUANCANE: "Huancané",
  ROMAN: "Román",
  CACERES: "Cáceres",
  MORROPON: "Morropón",
  PURUS: "Purús",
}

const PARTICULAS = new Set(["de", "del", "la", "los", "las", "el", "y"])

export function capitalizar(texto: string): string {
  return texto
    .trim()
    .split(/\s+/)
    .map((p, i) => {
      const clave = p.toUpperCase()
      if (TILDES[clave]) return TILDES[clave]
      const base = p.toLowerCase()
      if (i > 0 && PARTICULAS.has(base)) return base
      return base.charAt(0).toUpperCase() + base.slice(1)
    })
    .join(" ")
}

const features = PROVINCIAS.features.filter(
  (f) => f.properties.nombprov !== "VICTOR FAFARDO"
)

const sectores: Sector[] = []
const sectorPorCcdd = new Map<string, Sector>()
for (const f of features) {
  const ccdd = f.properties.ccdd
  if (sectorPorCcdd.has(ccdd)) continue
  const sector: Sector = {
    id: `sector-${ccdd}`,
    nombre: capitalizar(f.properties.nombdep),
    dp: ccdd,
  }
  sectorPorCcdd.set(ccdd, sector)
  sectores.push(sector)
}
sectores.sort((a, b) => (a.dp ?? "").localeCompare(b.dp ?? ""))

const zonas: Zona[] = []
const ubigeosVistos = new Set<string>()
for (const f of features) {
  const ccpp = f.properties.ccpp
  if (ubigeosVistos.has(ccpp)) continue
  ubigeosVistos.add(ccpp)
  zonas.push({
    id: `zona-${ccpp}`,
    nombre: capitalizar(f.properties.nombprov),
    sectorId: `sector-${f.properties.ccdd}`,
    ubigeo: ccpp,
  })
}
zonas.sort((a, b) => a.id.localeCompare(b.id))

const estaciones = estacionesData as Estacion[]

const rondas: Ronda[] = [
  { id: "ronda-1", sectorId: "sector-16", inicio: "2026-08-22", fin: "2026-08-24", fechaCreacion: "2026-08-20", estado: "Publicado" },
  { id: "ronda-2", sectorId: "sector-16", inicio: "2026-08-25", fin: "2026-08-27", fechaCreacion: "2026-08-26", estado: "Cargado" },
]

function generarDias(
  inicio: string,
  fin: string,
  fn: (fecha: string) => DiaPronostico
): DiaPronostico[] {
  const dias: DiaPronostico[] = []
  let cursor = inicio
  while (cursor <= fin) {
    dias.push(fn(cursor))
    cursor = addDaysISO(cursor, 1)
  }
  return dias
}

const zonasLoreto = zonas.filter((z) => z.sectorId === "sector-16")

const pronosticos: Pronostico[] = [
  // Ronda 1 (22–24): todas las zonas de Loreto → verde
  ...zonasLoreto.map((z) => ({
    id: `p1-${z.id}`,
    zonaId: z.id,
    rondaId: "ronda-1",
    inicio: "2026-08-22",
    fin: "2026-08-24",
    fechaCreacion: "2026-08-20",
    dias: generarDias("2026-08-22", "2026-08-24", (fecha) => ({
      fecha,
      tMin: 22,
      tMax: 32,
      descripcion: "Cielo con nubes dispersas variando a cielo nublado parcial por la tarde.",
    })),
  })),
  // Ronda 2 (25–27): solo Maynas → naranja
  {
    id: "p2-maynas",
    zonaId: "zona-1601",
    rondaId: "ronda-2",
    inicio: "2026-08-25",
    fin: "2026-08-27",
    fechaCreacion: "2026-08-26",
    dias: generarDias("2026-08-25", "2026-08-27", (fecha) => ({
      fecha,
      tMin: 22,
      tMax: 32,
      descripcion: "",
    })),
  },
]

export function seedState(): AppState {
  return {
    sectores,
    zonas,
    estaciones,
    rondas,
    pronosticos,
    avisos: avisosSeed,
    sectorActivoId: "sector-16",
    rango: { ...SEMANA_ACTIVA },
  }
}

const avisosSeed: Aviso[] = [
  {
    id: "aviso-342",
    numero: "342",
    codigo: "342-2026-SENAMHI/DMA",
    nivel: "ROJO",
    titulo: "INCREMENTO DE TEMPERATURA DIURNA EN LA COSTA Y SIERRA",
    fecha_emision: "2026-08-30T10:00",
    inicio_evento: "2026-09-01T00:00",
    fin_evento: "2026-09-03T23:59",
    departamentos:
      "Tumbes, Piura, Lambayeque, La Libertad, Áncash, Lima, Ica, Arequipa, Moquegua, Tacna, Cajamarca, Huánuco, Pasco, Junín, Huancavelica, Ayacucho, Apurímac, Cusco y Puno",
    estado: "Publicado",
    cuerpo:
      "El SENAMHI informa que, desde el martes 1 al jueves 3 de setiembre, continuará el incremento de la temperatura diurna, de moderada a extrema intensidad en la costa y de moderada a fuerte intensidad en la sierra del país. Se prevé escasa nubosidad hacia el mediodía, lo que contribuirá al aumento de los niveles de radiación ultravioleta (UV). Asimismo, se esperan ráfagas de viento con velocidades cercanas a los 40 km/h, principalmente durante las horas de la tarde. No se descarta la ocurrencia de lluvia localizada en la costa norte.",
    dias: [
      {
        id: "dia-342-1",
        fecha: "2026-09-01",
        descripcion:
          "El martes 1 de setiembre se prevén temperaturas máximas entre 29 °C y 36 °C en la costa norte, valores entre 24 °C y 26 °C en la costa central y valores entre 22 °C y 29 °C en la costa sur. Asimismo, se esperan temperaturas máximas entre 20 °C y 32 °C en la sierra norte, entre 17 °C y 29 °C en la sierra central, y registros entre 14 °C y 27 °C en la sierra sur.",
        mapa_url: "",
      },
      {
        id: "dia-342-2",
        fecha: "2026-09-02",
        descripcion:
          "El miércoles 2 de setiembre se prevén temperaturas máximas entre 29 °C y 36 °C en la costa norte, entre 24 °C y 28 °C en la costa central, y valores entre 21 °C y 29 °C en la costa sur. Asimismo, se esperan temperaturas máximas entre 18 °C y 32 °C en la sierra norte, entre 17 °C y 28 °C en la sierra central, y registros entre 14 °C y 26 °C en la sierra sur.",
        mapa_url: "",
      },
      {
        id: "dia-342-3",
        fecha: "2026-09-03",
        descripcion:
          "El jueves 3 de setiembre se prevén temperaturas máximas entre 29 °C y 36 °C en la costa norte, entre 24 °C y 29 °C en la costa central, y valores entre 22 °C y 30 °C en la costa sur. Asimismo, se esperan temperaturas máximas entre 18 °C y 32 °C en la sierra norte, entre 17 °C y 29 °C en la sierra central, y registros entre 14 °C y 26 °C en la sierra sur.",
        mapa_url: "",
      },
    ],
  },
  {
    id: "aviso-343",
    numero: "343",
    codigo: "343-2026-SENAMHI/DMA",
    nivel: "NARANJA",
    titulo: "INCREMENTO DE TEMPERATURA DIURNA EN LA SELVA NORTE Y CENTRO",
    fecha_emision: "2026-08-30T10:00",
    inicio_evento: "2026-09-01T10:00",
    fin_evento: "2026-09-02T23:59",
    departamentos: "Loreto, San Martín, Ucayali, Huánuco y Junín",
    estado: "Publicado",
    cuerpo:
      "El SENAMHI informa que, del martes 1 al miércoles 2 de setiembre, continuará el incremento de la temperatura diurna, de moderada a fuerte intensidad, en la selva norte y centro. Asimismo, se prevé escasa cobertura nubosa durante el día, lo que favorecerá el aumento de la radiación ultravioleta (UV). Además, se esperan ráfagas de viento con velocidades cercanas a los 45 km/h, principalmente durante las horas de la tarde. No se descarta la ocurrencia de chubascos.",
    dias: [
      {
        id: "dia-343-1",
        fecha: "2026-09-01",
        descripcion:
          "El martes 1 de setiembre se prevén temperaturas máximas entre 31 °C y 38 °C en la selva norte, y próximos a los 36 °C en la selva centro.",
        mapa_url: "",
      },
      {
        id: "dia-343-2",
        fecha: "2026-09-02",
        descripcion:
          "El miércoles 2 de setiembre se prevén temperaturas máximas entre 30 °C y 36 °C en la selva norte.",
        mapa_url: "",
      },
    ],
  },
]
