"use client"

import dynamic from "next/dynamic"

const MapaPublico = dynamic(() => import("./mapa-publico"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#a7cbe3] text-sm font-medium text-primary">
      Cargando mapa…
    </div>
  ),
})

export function MapaPublicoWrapper({ rondaId }: { rondaId: string }) {
  return <MapaPublico rondaId={rondaId} />
}
