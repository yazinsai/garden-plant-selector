# Garden Plant Selector

Plant selector app for Bahrain's hot desert climate (hardiness zone 11+). Browse plants suitable for the Gulf region, group them by watering needs, and configure Rainbird irrigation zones.

## Features

- **Browse Plants**: Search and filter plants from the Trefle botanical database, filtered for Gulf region compatibility
- **Watering Groups**: Plants automatically categorized by water requirements (None, Minimum, Average, Frequent)
- **Zone Configuration**: Map irrigation zones to watering groups for Rainbird systems
- **Persistent Selections**: Your plant selections and zone configs are saved to localStorage

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Get a free API token from [Trefle.io](https://trefle.io/)
4. Create `.env` file:
   ```
   VITE_TREFLE_TOKEN=your_token_here
   ```
5. Start the dev server:
   ```bash
   npm run dev
   ```

## Tech Stack

- React 18 + TypeScript
- Vite
- TanStack Query (data fetching)
- Zustand (state management)
- Tailwind CSS
- Trefle API (plant data)
