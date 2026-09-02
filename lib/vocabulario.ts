export interface OpcionVocabulario {
  codigo: string
  categoria: string
  texto: string
}

export const CATEGORIAS = [
  "Cielo",
  "Fenómenos",
  "Momento",
  "Viento",
] as const

export const VOCABULARIO: OpcionVocabulario[] = [
  // Cielo / nubosidad
  { codigo: "NUB-01", categoria: "Cielo", texto: "Cielo despejado" },
  { codigo: "NUB-02", categoria: "Cielo", texto: "Cielo con nubes dispersas" },
  { codigo: "NUB-03", categoria: "Cielo", texto: "Parcialmente nublado" },
  { codigo: "NUB-04", categoria: "Cielo", texto: "Cielo nublado" },
  { codigo: "NUB-05", categoria: "Cielo", texto: "Cielo cubierto" },
  // Fenómenos
  { codigo: "FEN-01", categoria: "Fenómenos", texto: "Lluvia ligera" },
  { codigo: "FEN-02", categoria: "Fenómenos", texto: "Lluvia moderada" },
  { codigo: "FEN-03", categoria: "Fenómenos", texto: "Lluvia intensa" },
  { codigo: "FEN-04", categoria: "Fenómenos", texto: "Llovizna" },
  { codigo: "FEN-05", categoria: "Fenómenos", texto: "Tormenta eléctrica" },
  { codigo: "FEN-06", categoria: "Fenómenos", texto: "Granizo" },
  { codigo: "FEN-07", categoria: "Fenómenos", texto: "Nevada" },
  { codigo: "FEN-08", categoria: "Fenómenos", texto: "Neblina" },
  // Momento / período
  { codigo: "MOM-01", categoria: "Momento", texto: "Durante la mañana" },
  { codigo: "MOM-02", categoria: "Momento", texto: "Durante la tarde" },
  { codigo: "MOM-03", categoria: "Momento", texto: "Durante la noche" },
  { codigo: "MOM-04", categoria: "Momento", texto: "Todo el día" },
  // Viento
  { codigo: "VIE-01", categoria: "Viento", texto: "Viento moderado" },
  { codigo: "VIE-02", categoria: "Viento", texto: "Viento fuerte" },
  { codigo: "VIE-03", categoria: "Viento", texto: "Ráfagas de viento" },
]

export const CONECTORES = [
  "y",
  "con",
  "seguido de",
  "variando a",
  "pasando a",
  "además de",
] as const

export interface FilaDescripcion {
  opcion: string
  condicion: string
  conector: string
}

export function filaVacia(): FilaDescripcion {
  return { opcion: "", condicion: "", conector: "" }
}

export function opcionPorCodigo(codigo: string): OpcionVocabulario | undefined {
  return VOCABULARIO.find((o) => o.codigo === codigo)
}

function fraseDeFila(fila: FilaDescripcion): string {
  const op = opcionPorCodigo(fila.opcion)
  return [op?.texto, fila.condicion.trim()]
    .filter(Boolean)
    .join(" ")
}

export function tieneFrase(fila: FilaDescripcion): boolean {
  return fraseDeFila(fila).length > 0
}

export function componerDescripcion(
  filas: FilaDescripcion[],
  textoFinal: string
): string {
  let out = ""

  for (let i = 0; i < filas.length; i++) {
    const frase = fraseDeFila(filas[i])
    if (!frase) continue

    out += (out ? " " : "") + frase

    const conector = filas[i].conector.trim()
    if (conector && filas.slice(i + 1).some(tieneFrase)) {
      out += " " + conector
    }
  }

  const fin = textoFinal.trim()
  if (fin) out += (out ? " " : "") + fin

  return out.trim()
}

export function validarDescripcion(
  filas: FilaDescripcion[],
  textoFinal: string
): { valida: boolean; errores: string[] } {
  const errores: string[] = []

  const hayFrase = filas.some(tieneFrase)
  if (!hayFrase && !textoFinal.trim()) {
    errores.push(
      "Selecciona al menos una frase o escribe un texto final para la descripción."
    )
  }

  filas.forEach((fila, i) => {
    if (!fila.conector.trim()) return
    if (!tieneFrase(fila)) {
      errores.push(
        `La fila ${i + 1} tiene un conector pero no tiene frase seleccionada.`
      )
      return
    }
    const haySiguiente = filas.slice(i + 1).some(tieneFrase)
    if (!haySiguiente) {
      errores.push(
        `El conector "${fila.conector.trim()}" de la fila ${i + 1} no está seguido de otra frase.`
      )
    }
  })

  return { valida: errores.length === 0, errores }
}
