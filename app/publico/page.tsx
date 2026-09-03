"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CloudRain } from "lucide-react"
import { MapaPublicoWrapper } from "@/components/publico/mapa-publico-wrapper"
import { AvisosPublicos } from "@/components/publico/avisos-publicos"
import { useStore } from "@/lib/store"

type Tab = "pronostico" | "avisos"

const tabs: { id: Tab; label: string }[] = [
  { id: "pronostico", label: "Pronóstico" },
  { id: "avisos", label: "Avisos" },
]

export default function PublicoPage() {
  const { state } = useStore()
  const [tab, setTab] = useState<Tab>("pronostico")

  const rondasPublicadas = state.rondas.filter((r) => r.estado === "Publicado")

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between bg-primary px-6 py-3 text-primary-foreground print:hidden">
        <div className="flex items-center gap-3">
          <CloudRain className="h-6 w-6" aria-hidden="true" />
          <span className="text-sm font-bold uppercase tracking-wide">
            Meteorología
          </span>
        </div>
        <div className="text-2xl font-bold">SENAMHI</div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-md border border-primary-foreground/30 px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-primary-foreground/10"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver al panel
        </Link>
      </header>

      <nav className="flex items-center gap-1 border-b border-border bg-card px-6 print:hidden">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? "page" : undefined}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="flex-1 p-6">
        {tab === "pronostico" ? (
          <div className="mx-auto flex max-w-6xl flex-col gap-4 print:hidden">
            {rondasPublicadas.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                No hay pronósticos publicados por el momento.
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-foreground">
                    Pronóstico publicado
                  </span>
                </div>
                <div className="relative mx-auto aspect-[7/10] w-full max-w-[720px] overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                  <MapaPublicoWrapper />
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-6xl">
            <AvisosPublicos />
          </div>
        )}
      </main>
    </div>
  )
}
