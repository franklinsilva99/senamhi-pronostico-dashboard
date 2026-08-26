"use client"

import { useState } from "react"

const sectors = ["SECTOR 1", "SECTOR 2", "SECTOR 3", "SECTOR 4"]

export function SectorTabs() {
  const [active, setActive] = useState(0)

  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      {sectors.map((s, i) => (
        <button
          key={s}
          type="button"
          onClick={() => setActive(i)}
          aria-pressed={active === i}
          className={`shrink-0 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
            active === i
              ? "bg-forecast text-forecast-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          {s}
        </button>
      ))}
      <span className="ml-1 shrink-0 whitespace-nowrap text-xs italic text-muted-foreground">
        (Ej. Loreto, Amazonas, Áncash)
      </span>
    </div>
  )
}
