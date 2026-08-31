import { AppSidebar } from "@/components/app-sidebar"

export default function AvisoPage() {
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
              Gestión de avisos meteorológicos e hidrológicos
            </p>
          </div>
        </header>

        <div className="mx-auto flex max-w-5xl flex-col gap-6 p-8">
          <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-foreground">
              Módulo en desarrollo
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Este módulo es independiente del módulo Pronóstico y se
              implementará próximamente.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
