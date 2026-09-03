declare module "shpjs" {
  const shp: (
    data: ArrayBuffer | string,
    options?: Record<string, unknown>
  ) => Promise<unknown>
  export = shp
}
