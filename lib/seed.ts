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

export const HOY = "2026-08-26"
export const SEMANA_ACTIVA = { inicio: "2026-08-22", fin: "2026-08-28" }

const sectorLoreto: Sector = { id: "sector-loreto", nombre: "Loreto", dp: "16" }
const sectorAmazonas: Sector = { id: "sector-amazonas", nombre: "Amazonas", dp: "01" }
const sectorCajamarca: Sector = { id: "sector-cajamarca", nombre: "Cajamarca", dp: "06" }

const zonas: Zona[] = [
  // Loreto
  { id: "zona-maynas", nombre: "Maynas", sectorId: "sector-loreto", ubigeo: "1601" },
  { id: "zona-mariscal-ramon-castilla", nombre: "Mariscal Ramón Castilla", sectorId: "sector-loreto", ubigeo: "1604" },
  { id: "zona-requena", nombre: "Requena", sectorId: "sector-loreto", ubigeo: "1605" },
  { id: "zona-loreto", nombre: "Loreto", sectorId: "sector-loreto", ubigeo: "1603" },
  { id: "zona-ucayali", nombre: "Ucayali", sectorId: "sector-loreto", ubigeo: "1606" },
  { id: "zona-alto-amazonas", nombre: "Alto Amazonas", sectorId: "sector-loreto", ubigeo: "1602" },
  { id: "zona-putumayo", nombre: "Putumayo", sectorId: "sector-loreto", ubigeo: "1608" },
  { id: "zona-datem-del-maranon", nombre: "Datem del Marañón", sectorId: "sector-loreto", ubigeo: "1607" },
  // Amazonas
  { id: "zona-condorcanqui", nombre: "Condorcanqui", sectorId: "sector-amazonas", ubigeo: "0104" },
  { id: "zona-bagua", nombre: "Bagua", sectorId: "sector-amazonas", ubigeo: "0102" },
  { id: "zona-utcubamba", nombre: "Utcubamba", sectorId: "sector-amazonas", ubigeo: "0107" },
  { id: "zona-bongara", nombre: "Bongará", sectorId: "sector-amazonas", ubigeo: "0103" },
  { id: "zona-chachapoyas", nombre: "Chachapoyas", sectorId: "sector-amazonas", ubigeo: "0101" },
  // Cajamarca
  { id: "zona-san-ignacio", nombre: "San Ignacio", sectorId: "sector-cajamarca", ubigeo: "0609" },
  { id: "zona-jaen", nombre: "Jaén", sectorId: "sector-cajamarca", ubigeo: "0608" },
  { id: "zona-cutervo", nombre: "Cutervo", sectorId: "sector-cajamarca", ubigeo: "0606" },
  { id: "zona-chota", nombre: "Chota", sectorId: "sector-cajamarca", ubigeo: "0604" },
  { id: "zona-santa-cruz", nombre: "Santa Cruz", sectorId: "sector-cajamarca", ubigeo: "0613" },
  { id: "zona-hualgayoc", nombre: "Hualgayoc", sectorId: "sector-cajamarca", ubigeo: "0607" },
  { id: "zona-cajamarca", nombre: "Cajamarca", sectorId: "sector-cajamarca", ubigeo: "0601" },
  { id: "zona-cajabamba", nombre: "Cajabamba", sectorId: "sector-cajamarca", ubigeo: "0602" },
  { id: "zona-san-marcos", nombre: "San Marcos", sectorId: "sector-cajamarca", ubigeo: "0610" },
  { id: "zona-san-miguel", nombre: "San Miguel", sectorId: "sector-cajamarca", ubigeo: "0611" },
  { id: "zona-celendin", nombre: "Celendín", sectorId: "sector-cajamarca", ubigeo: "0603" },
  { id: "zona-contumaza", nombre: "Contumazá", sectorId: "sector-cajamarca", ubigeo: "0605" },
  { id: "zona-san-pablo", nombre: "San Pablo", sectorId: "sector-cajamarca", ubigeo: "0612" },
]

const estaciones: Estacion[] = [
  // Loreto
  { id: "est-103057", codigo: "103057", nombre: "Amazonas", departamento: "Loreto", provincia: "Maynas", tipo: "meteorologica", lat: -3.764039, lng: -73.254864, altitud: 113, zonaId: "zona-maynas" },
  { id: "est-103052", codigo: "103052", nombre: "San Roque", departamento: "Loreto", provincia: "Maynas", tipo: "meteorologica", lat: -3.786561, lng: -73.29325, altitud: 118, zonaId: "zona-maynas" },
  { id: "est-103046", codigo: "103046", nombre: "Puerto Almendra", departamento: "Loreto", provincia: "Maynas", tipo: "meteorologica", lat: -3.828611, lng: -73.377019, altitud: 120, zonaId: "zona-maynas" },
  { id: "est-103031", codigo: "103031", nombre: "Caballococha", departamento: "Loreto", provincia: "Mariscal Ramón Castilla", tipo: "meteorologica", lat: -3.911228, lng: -70.511894, altitud: 107, zonaId: "zona-mariscal-ramon-castilla" },
  { id: "est-103054", codigo: "103054", nombre: "Pebas", departamento: "Loreto", provincia: "Mariscal Ramón Castilla", tipo: "meteorologica", lat: -3.318769, lng: -71.858828, altitud: 106, zonaId: "zona-mariscal-ramon-castilla" },
  { id: "est-105095", codigo: "105095", nombre: "Requena", departamento: "Loreto", provincia: "Requena", tipo: "meteorologica", lat: -5.043072, lng: -73.836136, altitud: 130, zonaId: "zona-requena" },
  { id: "est-100034", codigo: "100034", nombre: "Contamana", departamento: "Loreto", provincia: "Ucayali", tipo: "meteorologica", lat: -7.355331, lng: -75.006378, altitud: 185, zonaId: "zona-ucayali" },
  { id: "est-102006", codigo: "102006", nombre: "El Estrecho", departamento: "Loreto", provincia: "Putumayo", tipo: "meteorologica", lat: -2.44665, lng: -72.664336, altitud: 240, zonaId: "zona-putumayo" },
  { id: "est-104057", codigo: "104057", nombre: "San Lorenzo", departamento: "Loreto", provincia: "Datem del Marañón", tipo: "meteorologica", lat: -4.826961, lng: -76.555136, altitud: 250, zonaId: "zona-datem-del-maranon" },
  { id: "est-100128", codigo: "100128", codigoAnterior: "278", nombre: "San Ramón", departamento: "Loreto", provincia: "Alto Amazonas", tipo: "meteorologica", lat: -5.94, lng: -76.12, altitud: 142, zonaId: "zona-alto-amazonas" },
  // Amazonas
  { id: "est-104060", codigo: "104060", codigoAnterior: "256", nombre: "Santa María de Nieva", departamento: "Amazonas", provincia: "Condorcanqui", tipo: "meteorologica", lat: -4.83039, lng: -77.93928, altitud: 225, zonaId: "zona-condorcanqui" },
  { id: "est-105104", codigo: "105104", codigoAnterior: "229", nombre: "Chiriaco", departamento: "Amazonas", provincia: "Bagua", tipo: "meteorologica", lat: -5.16144, lng: -78.28806, altitud: 323, zonaId: "zona-bagua" },
  { id: "est-105075", codigo: "105075", codigoAnterior: "261", nombre: "Aramango", departamento: "Amazonas", provincia: "Bagua", tipo: "meteorologica", lat: -5.41994, lng: -78.43553, altitud: 508, zonaId: "zona-bagua" },
  { id: "est-105068", codigo: "105068", codigoAnterior: "253", nombre: "Bagua Chica", departamento: "Amazonas", provincia: "Utcubamba", tipo: "meteorologica", lat: -5.66148, lng: -78.53396, altitud: 397, zonaId: "zona-utcubamba" },
  { id: "est-106121", codigo: "106121", codigoAnterior: "3332", nombre: "El Palto", departamento: "Amazonas", provincia: "Utcubamba", tipo: "meteorologica", lat: -5.8927, lng: -78.2339, altitud: 1173, zonaId: "zona-utcubamba" },
  { id: "est-105079", codigo: "105079", codigoAnterior: "272", nombre: "Jazán", departamento: "Amazonas", provincia: "Bongará", tipo: "meteorologica", lat: -5.94485, lng: -77.97569, altitud: 1354, zonaId: "zona-bongara" },
  { id: "est-106011", codigo: "106011", codigoAnterior: "375", nombre: "Chachapoyas", departamento: "Amazonas", provincia: "Chachapoyas", tipo: "meteorologica", lat: -6.2083, lng: -77.86712, altitud: 2442, zonaId: "zona-chachapoyas" },
  // Cajamarca
  { id: "est-105107", codigo: "105107", codigoAnterior: "220", nombre: "Namballe", departamento: "Cajamarca", provincia: "San Ignacio", tipo: "meteorologica", lat: -4.99953, lng: -79.08862, altitud: 722, zonaId: "zona-san-ignacio" },
  { id: "est-105058", codigo: "105058", codigoAnterior: "242", nombre: "San Ignacio", departamento: "Cajamarca", provincia: "San Ignacio", tipo: "meteorologica", lat: -5.14708, lng: -78.99512, altitud: 1243, zonaId: "zona-san-ignacio" },
  { id: "est-105074", codigo: "105074", codigoAnterior: "260", nombre: "Chirinos", departamento: "Cajamarca", provincia: "San Ignacio", tipo: "meteorologica", lat: -5.3085, lng: -78.89759, altitud: 1772, zonaId: "zona-san-ignacio" },
  { id: "est-105067", codigo: "105067", codigoAnterior: "252", nombre: "Jaén", departamento: "Cajamarca", provincia: "Jaén", tipo: "meteorologica", lat: -5.67664, lng: -78.77416, altitud: 618, zonaId: "zona-jaen" },
  { id: "est-105053", codigo: "105053", codigoAnterior: "2129", nombre: "Sallique", departamento: "Cajamarca", provincia: "Jaén", tipo: "meteorologica", lat: -5.65886, lng: -79.31264, altitud: 1804, zonaId: "zona-jaen" },
  { id: "est-106057", codigo: "106057", codigoAnterior: "352", nombre: "Cutervo", departamento: "Cajamarca", provincia: "Cutervo", tipo: "meteorologica", lat: -6.37964, lng: -78.80512, altitud: 2668, zonaId: "zona-cutervo" },
  { id: "est-106034", codigo: "106034", codigoAnterior: "303", nombre: "Chota", departamento: "Cajamarca", provincia: "Chota", tipo: "meteorologica", lat: -6.54713, lng: -78.64863, altitud: 2468, zonaId: "zona-chota" },
  { id: "est-106054", codigo: "106054", codigoAnterior: "343", nombre: "Huambos", departamento: "Cajamarca", provincia: "Chota", tipo: "meteorologica", lat: -6.45368, lng: -78.96315, altitud: 2258, zonaId: "zona-chota" },
  { id: "est-106058", codigo: "106058", codigoAnterior: "353", nombre: "Cochabamba", departamento: "Cajamarca", provincia: "Chota", tipo: "meteorologica", lat: -6.46009, lng: -78.8886, altitud: 1653, zonaId: "zona-chota" },
  { id: "est-106053", codigo: "106053", codigoAnterior: "341", nombre: "Llama", departamento: "Cajamarca", provincia: "Chota", tipo: "meteorologica", lat: -6.51443, lng: -79.12262, altitud: 2096, zonaId: "zona-chota" },
  { id: "est-106022", codigo: "106022", codigoAnterior: "395", nombre: "Chancay Baños", departamento: "Cajamarca", provincia: "Santa Cruz", tipo: "meteorologica", lat: -6.575, lng: -78.86722, altitud: 1638, zonaId: "zona-santa-cruz" },
  { id: "est-106056", codigo: "106056", codigoAnterior: "351", nombre: "Santa Cruz", departamento: "Cajamarca", provincia: "Santa Cruz", tipo: "meteorologica", lat: -6.61657, lng: -78.94761, altitud: 2002, zonaId: "zona-santa-cruz" },
  { id: "est-100015", codigo: "100015", codigoAnterior: "362", nombre: "Bambamarca", departamento: "Cajamarca", provincia: "Hualgayoc", tipo: "meteorologica", lat: -6.67655, lng: -78.51834, altitud: 2495, zonaId: "zona-hualgayoc" },
  { id: "est-107028", codigo: "107028", codigoAnterior: "304", nombre: "Augusto Weberbauer", departamento: "Cajamarca", provincia: "Cajamarca", tipo: "meteorologica", lat: -7.1675, lng: -78.49309, altitud: 2673, zonaId: "zona-cajamarca" },
  { id: "est-107008", codigo: "107008", codigoAnterior: "373", nombre: "Cajabamba", departamento: "Cajamarca", provincia: "Cajabamba", tipo: "meteorologica", lat: -7.62166, lng: -78.05131, altitud: 2625, zonaId: "zona-cajabamba" },
  { id: "est-107006", codigo: "107006", codigoAnterior: "370", nombre: "San Marcos", departamento: "Cajamarca", provincia: "San Marcos", tipo: "meteorologica", lat: -7.32249, lng: -78.1727, altitud: 2287, zonaId: "zona-san-marcos" },
  { id: "est-106038", codigo: "106038", codigoAnterior: "308", nombre: "San Miguel", departamento: "Cajamarca", provincia: "San Miguel", tipo: "meteorologica", lat: -6.99684, lng: -78.85308, altitud: 2666, zonaId: "zona-san-miguel" },
  { id: "est-106010", codigo: "106010", codigoAnterior: "371", nombre: "Celendín", departamento: "Cajamarca", provincia: "Celendín", tipo: "meteorologica", lat: -6.85292, lng: -78.14485, altitud: 2602, zonaId: "zona-celendin" },
  { id: "est-107052", codigo: "107052", codigoAnterior: "354", nombre: "Contumazá", departamento: "Cajamarca", provincia: "Contumazá", tipo: "meteorologica", lat: -7.36521, lng: -78.82273, altitud: 2542, zonaId: "zona-contumaza" },
  { id: "est-107036", codigo: "107036", codigoAnterior: "319", nombre: "San Pablo", departamento: "Cajamarca", provincia: "San Pablo", tipo: "meteorologica", lat: -7.11775, lng: -78.83083, altitud: 2325, zonaId: "zona-san-pablo" },
  { id: "est-107002", codigo: "107002", codigoAnterior: "359", nombre: "Granja Porcón", departamento: "Cajamarca", provincia: "Cajamarca", tipo: "meteorologica", lat: -7.13753, lng: -78.6334, altitud: 3149, zonaId: "zona-cajamarca" },
  { id: "est-106039", codigo: "106039", codigoAnterior: "309", nombre: "Quilcate", departamento: "Cajamarca", provincia: "San Miguel", tipo: "meteorologica", lat: -6.82275, lng: -78.744, altitud: 3076, zonaId: "zona-san-miguel" },
  { id: "est-107005", codigo: "107005", codigoAnterior: "369", nombre: "San Juan", departamento: "Cajamarca", provincia: "Cajamarca", tipo: "meteorologica", lat: -7.29756, lng: -78.49106, altitud: 2253, zonaId: "zona-cajamarca" },
  { id: "est-107057", codigo: "107057", codigoAnterior: "153201", nombre: "San Benito", departamento: "Cajamarca", provincia: "Contumazá", tipo: "meteorologica", lat: -7.42819, lng: -78.92673, altitud: 1317, zonaId: "zona-contumaza" },
  { id: "est-107093", codigo: "107093", codigoAnterior: "153331", nombre: "La Encañada", departamento: "Cajamarca", provincia: "Cajamarca", tipo: "meteorologica", lat: -7.12333, lng: -78.33306, altitud: 2980, zonaId: "zona-cajamarca" },
]

const rondas: Ronda[] = [
  { id: "ronda-1", sectorId: "sector-loreto", inicio: "2026-08-22", fin: "2026-08-24", fechaCreacion: "2026-08-20", estado: "Publicado" },
  { id: "ronda-2", sectorId: "sector-loreto", inicio: "2026-08-25", fin: "2026-08-27", fechaCreacion: "2026-08-26", estado: "Cargado" },
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

const zonasLoreto = zonas.filter((z) => z.sectorId === "sector-loreto")

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
    zonaId: "zona-maynas",
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
    sectores: [sectorLoreto, sectorAmazonas, sectorCajamarca],
    zonas,
    estaciones,
    rondas,
    pronosticos,
    avisos: avisosSeed,
    sectorActivoId: "sector-loreto",
    rango: { ...SEMANA_ACTIVA },
  }
}

const avisosSeed: Aviso[] = [
  {
    id: "aviso-1",
    codigo: "230-2026-SENAMHI/DMA/SPM",
    titulo: "AVISO DE CORTO PLAZO ANTE LLUVIAS INTENSAS",
    evento: "LLUVIAS INTENSAS",
    sede: "DZ 08",
    responsable: "Dirección de Meteorología",
    fecha_emision: "2026-08-26T10:00",
    valido_desde: "2026-08-26T10:00",
    valido_hasta: "2026-08-29T23:59",
    proxima_actualizacion: "2026-08-27T10:00",
    departamentos_alertados: "LORETO, UCAYALI, HUÁNUCO, PASCO",
    estado: "Publicado",
    mapa_url: "",
    perspectivas: {
      SELVA:
        "Lluvias intensas durante el día, con descargas eléctricas y ráfagas de viento.",
      SIERRA: "Cielo nublado con llovizna ligera por la tarde.",
      COSTA: "Cielo nublado parcial con brillo solar.",
    },
    detalles: {
      SELVA: {
        tipo_precipitacion: "Lluvia intensa",
        max_cantidad_pp: "60",
        probabilidad: "A",
        fenomenos_asociados: "Descargas eléctricas, ráfagas de viento",
      },
      SIERRA: {
        tipo_precipitacion: "Llovizna",
        max_cantidad_pp: "10",
        probabilidad: "M",
        fenomenos_asociados: "Neblina",
      },
      COSTA: {
        tipo_precipitacion: "Ninguna",
        max_cantidad_pp: "0",
        probabilidad: "M",
        fenomenos_asociados: "Brillo solar",
      },
    },
  },
]
