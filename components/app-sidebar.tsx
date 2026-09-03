import {
  CloudRain,
  LayoutDashboard,
  TriangleAlert,
  BarChart3,
  Bell,
  Settings,
} from "lucide-react"

const navItems = [
  { icon: LayoutDashboard, label: "Panel", href: "#" },
  { icon: CloudRain, label: "Pronóstico", href: "/" },
  { icon: TriangleAlert, label: "Aviso", href: "/aviso" },
  { icon: BarChart3, label: "Reportes", href: "#" },
  { icon: Bell, label: "Alertas", href: "#" },
]

export function AppSidebar({ active = "Pronóstico" }: { active?: string }) {
  return (
    <aside className="flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-5 py-5">
        <img
          src="/logo-senamhi.svg"
          alt="SENAMHI"
          className="h-12 w-auto"
        />
      </div>

      <div className="mx-5 mb-4 rounded-xl bg-sidebar-accent px-4 py-3">
        <p className="text-lg font-bold tracking-tight">Pronóstico</p>
        <div className="mt-1 h-px w-full bg-sidebar-border" />
        <p className="mt-2 font-mono text-xs tracking-widest text-sidebar-foreground/60">
          — — — — — — —
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            aria-current={active === label ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active === label
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </a>
        ))}
      </nav>

      <div className="border-t border-sidebar-border px-3 py-4">
        <a
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <Settings className="h-4 w-4" aria-hidden="true" />
          Configuración
        </a>
      </div>
    </aside>
  )
}
