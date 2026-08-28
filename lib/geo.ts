import provinciasData from "@/lib/data/provincias.json"

export interface ProvinciaFeature {
  type: "Feature"
  properties: {
    OBJECTID: number
    ccpp: string
    ccdd: string
    nombprov: string
    nombdep: string
    fuente: string
    [key: string]: unknown
  }
  geometry:
    | { type: "Polygon"; coordinates: number[][][] }
    | { type: "MultiPolygon"; coordinates: number[][][][] }
}

export interface ProvinciaCollection {
  type: "FeatureCollection"
  features: ProvinciaFeature[]
}

export const PROVINCIAS = provinciasData as unknown as ProvinciaCollection

export function featurePorUbigeo(ubigeo: string): ProvinciaFeature | undefined {
  return PROVINCIAS.features.find((f) => f.properties.ccpp === ubigeo)
}

export function anillosDeFeature(feature: ProvinciaFeature): [number, number][][] {
  if (feature.geometry.type === "Polygon") {
    return feature.geometry.coordinates.map((ring) =>
      ring.map(([lng, lat]) => [lat, lng] as [number, number])
    )
  }

  return feature.geometry.coordinates.map((poligono) =>
    poligono[0].map(([lng, lat]) => [lat, lng] as [number, number])
  )
}
