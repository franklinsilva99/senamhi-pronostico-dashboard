export type TipoEstacion = "meteorologica" | "hidrologica"

export interface Sector {
  id: string
  nombre: string
  dp?: string
}

export interface Zona {
  id: string
  nombre: string
  sectorId: string
  ubigeo?: string
}

export interface Estacion {
  id: string
  codigo: string
  codigoAnterior?: string
  nombre: string
  departamento: string
  provincia: string
  tipo: TipoEstacion
  lat: number
  lng: number
  altitud?: number
  zonaId: string
}

export interface MedicionDiaria {
  fecha: string
  tMax: number
  tMin: number
}

export interface DiaPronostico {
  fecha: string
  tMin: number
  tMax: number
  descripcion: string
  icono?: string
}

export type EstadoPublicacion = "Cargado" | "Publicado"

export interface Ronda {
  id: string
  sectorId: string
  inicio: string
  fin: string
  fechaCreacion: string
  estado: EstadoPublicacion
}

export interface Pronostico {
  id: string
  zonaId: string
  rondaId: string
  inicio: string
  fin: string
  dias: DiaPronostico[]
  fechaCreacion: string
}

export type DiaEstado = "forecast" | "process" | "noforecast" | "empty"

export interface RangoFechas {
  inicio: string
  fin: string
}

export type RegionAviso = "SELVA" | "SIERRA" | "COSTA"
export type EstadoAviso = EstadoPublicacion
export type ProbabilidadAviso = "A" | "M"

export interface DetalleAviso {
  tipo_precipitacion: string
  max_cantidad_pp: string
  probabilidad: ProbabilidadAviso
  fenomenos_asociados: string
}

export interface Aviso {
  id: string
  codigo: string
  titulo: string
  evento: string
  sede: string
  responsable: string
  fecha_emision: string
  valido_desde: string
  valido_hasta: string
  proxima_actualizacion: string
  departamentos_alertados: string
  estado: EstadoAviso
  mapa_url: string
  perspectivas: Record<RegionAviso, string>
  detalles: Record<RegionAviso, DetalleAviso>
}

export interface AppState {
  sectores: Sector[]
  zonas: Zona[]
  estaciones: Estacion[]
  rondas: Ronda[]
  pronosticos: Pronostico[]
  avisos: Aviso[]
  sectorActivoId: string
  rango: RangoFechas
}
