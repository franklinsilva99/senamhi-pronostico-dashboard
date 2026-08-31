# SENAMHI · Sistema de Pronóstico Meteorológico

Aplicación web para la gestión de pronósticos meteorológicos por sectores, zonas
y estaciones.

## Stack
- Next.js 16 (App Router + Turbopack)
- React 19 + TypeScript
- Tailwind CSS 4
- Leaflet / react-leaflet (mapas)
- Recharts (gráficos)

## Requisitos
- Node.js 18+ y pnpm

## Instalación y ejecución
```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build
pnpm start
```

## Módulos
- Pronóstico: calendario, sectores, zonas, mapa, gráfico y edición de pronósticos.
- Aviso: módulo independiente (en desarrollo).

## Persistencia
Los datos se guardan en `localStorage` (clave `senamhi.pronostico.v6`) a partir
de un estado inicial (`lib/seed.ts`).
