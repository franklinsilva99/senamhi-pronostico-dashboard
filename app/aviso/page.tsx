"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { AvisoListado } from "@/components/aviso/aviso-listado"
import { AvisoForm } from "@/components/aviso/aviso-form"
import { AvisoDetalle } from "@/components/aviso/aviso-detalle"
import { avisoVacio } from "@/lib/aviso"
import { useStore } from "@/lib/store"
import type { Aviso } from "@/lib/types"

export default function AvisoPage() {
  const { state, guardarAviso, eliminarAviso } = useStore()

  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [creando, setCreando] = useState(false)
  const [viendoId, setViendoId] = useState<string | null>(null)

  const avisos = [...state.avisos].sort((a, b) =>
    b.fecha_emision.localeCompare(a.fecha_emision)
  )

  const editando = editandoId
    ? avisos.find((a) => a.id === editandoId) ?? null
    : null

  const viendo = viendoId
    ? avisos.find((a) => a.id === viendoId) ?? null
    : null

  const guardar = (aviso: Aviso) => {
    guardarAviso(aviso)
    setEditandoId(null)
    setCreando(false)
  }

  const eliminar = (id: string) => {
    if (window.confirm("¿Eliminar este aviso?")) {
      eliminarAviso(id)
    }
  }

  const mostrandoFormulario = creando || editando

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar active="Aviso" />

      <main className="flex-1 overflow-x-hidden">
        <header className="flex items-center justify-between border-b border-border bg-card px-8 py-5">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Aviso
            </h1>
            <p className="text-sm text-muted-foreground">
              Gestión de avisos meteorológicos
            </p>
          </div>
          <a
            href="/publico"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            <Globe className="h-4 w-4" aria-hidden="true" />
            Ver público
          </a>
        </header>

        <div className="mx-auto flex max-w-6xl flex-col gap-6 p-8">
          {mostrandoFormulario ? (
            <AvisoForm
              inicial={editando ?? avisoVacio()}
              onGuardar={guardar}
              onCancelar={() => {
                setEditandoId(null)
                setCreando(false)
              }}
            />
          ) : (
            <AvisoListado
              avisos={avisos}
              onCrear={() => setCreando(true)}
              onVer={(id) => setViendoId(id)}
              onEditar={(id) => setEditandoId(id)}
              onEliminar={eliminar}
            />
          )}
        </div>
      </main>

      {viendo && <AvisoDetalle aviso={viendo} onCerrar={() => setViendoId(null)} />}
    </div>
  )
}
