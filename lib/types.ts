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

export interface DiaPronostico {
  fecha: string
  tMin: number
  tMax: number
  descripcion: string
  icono?: string
}

export interface Ronda {
  id: string
  sectorId: string
  inicio: string
  fin: string
  fechaCreacion: string
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

export interface AppState {
  sectores: Sector[]
  zonas: Zona[]
  estaciones: Estacion[]
  rondas: Ronda[]
  pronosticos: Pronostico[]
  sectorActivoId: string
  rango: RangoFechas
}
