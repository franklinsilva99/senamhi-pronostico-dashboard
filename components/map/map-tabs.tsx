"use client"

export type MapTab = "MAPA" | "GRÁFICO"

const tabs: MapTab[] = ["MAPA", "GRÁFICO"]

export function MapTabs({
  active,
  onChange,
}: {
  active: MapTab
  onChange: (tab: MapTab) => void
}) {
  return (
    <div className="flex items-end gap-1 border-b border-border px-3">
      {tabs.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          aria-current={active === t ? "true" : undefined}
          className={`-mb-px rounded-t-lg border px-4 py-1.5 text-xs font-bold tracking-wide transition-colors ${
            active === t
              ? "border-border border-b-card bg-card text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}
