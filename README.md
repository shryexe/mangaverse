# MangaVerse

A Netflix-style anime streaming UI built with React, TypeScript, and Tailwind CSS.

## Features

- 🎬 Netflix-style hero section with blurred anime collage background
- 🔍 Real-time anime search using Jikan API
- 📺 Horizontal scroll carousels for anime categories
- 🎴 3D tilt effect on cards with glare animation
- 📱 Fully responsive design
- ⚡ Lazy loading and performance optimized

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React Icons
- Jikan API (MyAnimeList)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mangaverse.git

# Navigate to project directory
cd mangaverse

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── AnimeCard.tsx      # Individual anime card with hover effects
│   ├── AnimeGrid.tsx      # Grid layout for search results
│   ├── AnimeRow.tsx       # Horizontal scroll carousel
│   ├── Footer.tsx         # Site footer
│   ├── Header.tsx         # Navigation with search
│   ├── Hero.tsx           # Hero section with collage background
│   ├── PeopleAlsoSearch.tsx
│   ├── Recommendations.tsx
│   ├── SearchBar.tsx      # Search input component
│   ├── TeaserModal.tsx    # Anime detail modal
│   └── WatchingNow.tsx    # Continue watching section with 3D tilt
├── services/
│   └── animeService.ts    # Jikan API integration
├── types/
│   └── anime.ts           # TypeScript interfaces
├── utils/
│   └── imageUtils.ts      # Image handling utilities
├── App.tsx                # Main application component
├── main.tsx               # Entry point
└── index.css              # Global styles
```

## API

This project uses the [Jikan API](https://jikan.moe/) to fetch anime data from MyAnimeList.

## License

MIT
