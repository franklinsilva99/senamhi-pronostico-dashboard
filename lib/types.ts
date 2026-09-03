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
  copiaDe?: string
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

export type NivelAviso = "ROJO" | "NARANJA" | "AMARILLO"
export type EstadoAviso = EstadoPublicacion

export interface DiaAviso {
  id: string
  fecha: string
  descripcion: string
  mapa_url: string
  mapa_geojson_id?: string
}

export interface Aviso {
  id: string
  numero: string
  codigo: string
  nivel: NivelAviso
  titulo: string
  fecha_emision: string
  inicio_evento: string
  fin_evento: string
  departamentos: string
  cuerpo: string
  dias: DiaAviso[]
  estado: EstadoAviso
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
