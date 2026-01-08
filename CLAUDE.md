# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Vite (includes API proxy)
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Environment Setup

Copy `.env.example` to `.env` and add your Trefle API token:
```
VITE_TREFLE_TOKEN=your_token_here
```

## Architecture

Plant selector app for Bahrain's climate (hardiness zone 11+). Users browse plants, select them, configure irrigation zones by watering needs, and get a summary.

### Data Flow

```
Trefle API → perenualApi.ts → usePlants hook → React Query → Components
                                                    ↓
                              Zustand stores ← User selections
```

### Key Stores (Zustand with localStorage persistence)

- **plantSelectionStore**: Selected plants with quantities, grouped by watering level
- **zoneStore**: Irrigation zone configuration (maps zones to watering groups)
- **filterStore**: Search/filter state (non-persisted)

### Routes

- `/` - Browse and select plants
- `/review` - Review selections grouped by watering needs
- `/zones` - Configure Rainbird irrigation zones
- `/summary` - Final plant list with zone assignments

### API Layer

`src/services/perenualApi.ts` handles Trefle API with:
- Vite proxy at `/api/trefle` → `https://trefle.io/api/v1` (avoids CORS)
- Gulf region mode: fetches all GST distribution plants, caches them, filters client-side
- Global mode: uses server-side filtering via Trefle's species/search endpoints
- Plant data transformed to internal `Plant` type with estimated watering levels

### Types

- `Plant` / `SelectedPlant`: Core plant data with watering levels (None/Minimum/Average/Frequent)
- `IrrigationZone` / `ZoneWithPlants`: Rainbird zone config linked to watering groups
- `TreflePlant` / `TrefleListResponse`: Raw Trefle API types

### UI Components

Using shadcn/ui patterns with `@/components/ui/*`. Custom theme with desert-inspired colors (sand, oasis, terracotta) defined as CSS variables.

Path alias: `@/*` → `./src/*`
