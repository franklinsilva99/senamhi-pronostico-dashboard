"use client"

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from "react"
import type { AppState, Pronostico, RangoFechas, Ronda } from "@/lib/types"
import { seedState } from "@/lib/seed"

type Action =
  | { type: "hydrate"; state: AppState }
  | { type: "seleccionarSector"; sectorId: string }
  | { type: "guardarPronostico"; pronostico: Pronostico }
  | { type: "eliminarPronostico"; id: string }
  | { type: "crearRonda"; ronda: Ronda }
  | { type: "eliminarRonda"; id: string }
  | { type: "setRango"; rango: RangoFechas }

const STORAGE_KEY = "senamhi.pronostico.v5"

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "hydrate":
      return action.state
    case "seleccionarSector":
      return { ...state, sectorActivoId: action.sectorId }
    case "guardarPronostico": {
      const existe = state.pronosticos.some((p) => p.id === action.pronostico.id)
      const pronosticos = existe
        ? state.pronosticos.map((p) =>
            p.id === action.pronostico.id ? action.pronostico : p
          )
        : [...state.pronosticos, action.pronostico]
      return { ...state, pronosticos }
    }
    case "eliminarPronostico":
      return {
        ...state,
        pronosticos: state.pronosticos.filter((p) => p.id !== action.id),
      }
    case "crearRonda":
      return { ...state, rondas: [...state.rondas, action.ronda] }
    case "eliminarRonda":
      return {
        ...state,
        rondas: state.rondas.filter((r) => r.id !== action.id),
        pronosticos: state.pronosticos.filter((p) => p.rondaId !== action.id),
      }
    case "setRango":
      return { ...state, rango: action.rango }
    default:
      return state
  }
}

interface StoreValue {
  state: AppState
  seleccionarSector: (sectorId: string) => void
  guardarPronostico: (pronostico: Pronostico) => void
  eliminarPronostico: (id: string) => void
  crearRonda: (ronda: Ronda) => void
  eliminarRonda: (id: string) => void
  setRango: (rango: RangoFechas) => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, seedState)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        dispatch({ type: "hydrate", state: JSON.parse(saved) as AppState })
      } catch {
        // datos corruptos: se conserva el seed
      }
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state, hydrated])

  const value: StoreValue = {
    state,
    seleccionarSector: (sectorId) =>
      dispatch({ type: "seleccionarSector", sectorId }),
    guardarPronostico: (pronostico) =>
      dispatch({ type: "guardarPronostico", pronostico }),
    eliminarPronostico: (id) => dispatch({ type: "eliminarPronostico", id }),
    crearRonda: (ronda) => dispatch({ type: "crearRonda", ronda }),
    eliminarRonda: (id) => dispatch({ type: "eliminarRonda", id }),
    setRango: (rango) => dispatch({ type: "setRango", rango }),
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore debe usarse dentro de <StoreProvider>")
  return ctx
}
