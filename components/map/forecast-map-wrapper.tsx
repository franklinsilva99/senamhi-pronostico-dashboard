"use client"

import dynamic from "next/dynamic"

const ForecastMap = dynamic(() => import("./forecast-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#a7cbe3] text-sm font-medium text-primary">
      Cargando mapa…
    </div>
  ),
})

export function ForecastMapWrapper() {
  return <ForecastMap />
}
