import { useState, useEffect, useCallback, lazy, Suspense, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Hero from './components/Hero'
import AnimeRow from './components/AnimeRow'
import AnimeGrid from './components/AnimeGrid'
import Footer from './components/Footer'
import WatchingNow from './components/WatchingNow'
import Recommendations from './components/Recommendations'
import PeopleAlsoSearch from './components/PeopleAlsoSearch'
import { Anime } from './types/anime'
import {
  fetchTopAnime,
  fetchTrendingAnime,
  fetchPopularAnime,
  fetchUpcomingAnime,
  fetchAnimeByGenre,
  searchAnime
} from './services/animeService'

// Lazy load only modal
const TeaserModal = lazy(() => import('./components/TeaserModal'))

function App() {
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null)
  const dataLoadedRef = useRef(false)

  // Hero data
  const [heroAnime, setHeroAnime] = useState<Anime[]>([])

  // Homepage data - separate state for each section
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([])
  const [popularAnime, setPopularAnime] = useState<Anime[]>([])
  const [topAnime, setTopAnime] = useState<Anime[]>([])
  const [upcomingAnime, setUpcomingAnime] = useState<Anime[]>([])
  const [actionAnime, setActionAnime] = useState<Anime[]>([])

  // Search state - null = HOME MODE, [] or [...] = SEARCH MODE
  const [searchResults, setSearchResults] = useState<Anime[] | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Single loading state for initial load
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // Derived state
  const isSearchMode = searchResults !== null
  const showNoResults = isSearchMode && searchResults.length === 0 && !searchLoading

  // Load all data ONCE on mount - optimized for speed
  useEffect(() => {
    if (dataLoadedRef.current) return
    dataLoadedRef.current = true

    const loadAllData = async () => {
      try {
        // Batch 1: Fetch hero + trending + popular in parallel (3 requests)
        const [hero, trending, popular] = await Promise.all([
          fetchTopAnime(12),
          fetchTrendingAnime(12),
          fetchPopularAnime(12)
        ])
        
        // Set immediately for fast first paint
        setHeroAnime(hero.slice(0, 6))
        setTrendingAnime(trending)
        setPopularAnime(popular)
        setTopAnime(hero) // Reuse hero data
        setIsInitialLoading(false) // Show content now!
        
        // Batch 2: Fetch remaining data in background (non-blocking)
        Promise.all([
          fetchUpcomingAnime(12),
          fetchAnimeByGenre(1, 12)
        ]).then(([upcoming, action]) => {
          setUpcomingAnime(upcoming)
          setActionAnime(action)
        }).catch(console.error)
        
      } catch (error) {
        console.error('Failed to load data:', error)
        setIsInitialLoading(false)
      }
    }

    loadAllData()
  }, [])

  // Search handlers
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null)
      setSearchQuery('')
      return
    }

    setSearchQuery(query)
    setSearchLoading(true)
    setSearchResults([])

    try {
      const results = await searchAnime(query, 24)
      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }, [])

  const handleClearSearch = useCallback(() => {
    setSearchResults(null)
    setSearchQuery('')
    setSearchLoading(false)
  }, [])

  const handlePosterClick = useCallback((anime: Anime) => {
    setSelectedAnime(anime)
  }, [])

  const handleCloseTeaser = useCallback(() => {
    setSelectedAnime(null)
  }, [])

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header onSearch={handleSearch} onClearSearch={handleClearSearch} />

      {/* Hero Section */}
      <div className="relative">
        <Hero 
          heroAnime={heroAnime}
          featuredAnime={heroAnime[0]}
          searchFeaturedAnime={isSearchMode && searchResults && searchResults.length > 0 ? searchResults[0] : null}
          isSearchMode={isSearchMode && searchResults !== null && searchResults.length > 0}
        />
      </div>

      <AnimatePresence mode="wait">
        {isSearchMode ? (
          // SEARCH MODE
          <motion.main
            key="search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-20 min-h-[50vh] bg-[#0f0f0f] -mt-24"
          >
            {searchLoading ? (
              <div className="px-4 md:px-12 lg:px-16 py-8 pt-28">
                <h2 className="text-xl md:text-2xl text-white font-semibold mb-6">
                  Searching for "{searchQuery}"...
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="aspect-[2/3] bg-[#1a1a1a] rounded-md animate-pulse" />
                  ))}
                </div>
              </div>
            ) : showNoResults ? (
              <div className="px-4 md:px-12 lg:px-16 py-16 pt-28 text-center">
                <h2 className="text-2xl text-white font-semibold mb-4">
                  No results for "{searchQuery}"
                </h2>
                <p className="text-gray-500 mb-6">Try a different search term</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearSearch}
                  className="px-6 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200 transition-colors"
                >
                  Back to Home
                </motion.button>
              </div>
            ) : (
              <div className="pt-4">
                <AnimeGrid
                  title={`Search Results for "${searchQuery}"`}
                  animeList={searchResults || []}
                  onPosterClick={handlePosterClick}
                />
              </div>
            )}
          </motion.main>
        ) : (
          // HOME MODE
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Content overlaps Hero */}
            <main className="relative z-20 -mt-24 space-y-2 bg-gradient-to-b from-transparent via-[#0f0f0f] to-[#0f0f0f]">
              <AnimeRow
                title="Trending Now"
                animeList={trendingAnime}
                isLoading={isInitialLoading}
                onPosterClick={handlePosterClick}
              />
              <AnimeRow
                title="Popular on MangaVerse"
                animeList={popularAnime}
                isLoading={isInitialLoading}
                onPosterClick={handlePosterClick}
              />
              <AnimeRow
                title="Top Rated"
                animeList={topAnime}
                isLoading={isInitialLoading}
                onPosterClick={handlePosterClick}
              />
              <AnimeRow
                title="New Releases"
                animeList={upcomingAnime}
                isLoading={isInitialLoading}
                onPosterClick={handlePosterClick}
              />
              <AnimeRow
                title="Action & Adventure"
                animeList={actionAnime}
                isLoading={isInitialLoading}
                onPosterClick={handlePosterClick}
              />
            </main>

            {/* WatchingNow Section */}
            <WatchingNow
              animeList={trendingAnime.slice(0, 6)}
              isLoading={isInitialLoading}
            />

            {/* Recommendations Section */}
            <Recommendations
              animeList={topAnime.slice(0, 10)}
              isLoading={isInitialLoading}
              onPosterClick={handlePosterClick}
            />

            {/* People Also Search */}
            <PeopleAlsoSearch />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      <Suspense fallback={null}>
        <TeaserModal anime={selectedAnime} onClose={handleCloseTeaser} />
      </Suspense>
    </div>
  )
}

export default App
