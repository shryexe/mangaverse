import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Hero from './components/Hero'
import AnimeRow from './components/AnimeRow'
import AnimeGrid from './components/AnimeGrid'
import Footer from './components/Footer'
import { Anime } from './types/anime'
import {
  fetchTopAnime,
  fetchTrendingAnime,
  fetchPopularAnime,
  fetchUpcomingAnime,
  fetchAnimeByGenre,
  searchAnime
} from './services/animeService'

// Lazy load non-critical components
const WatchingNow = lazy(() => import('./components/WatchingNow'))
const Recommendations = lazy(() => import('./components/Recommendations'))
const PeopleAlsoSearch = lazy(() => import('./components/PeopleAlsoSearch'))
const TeaserModal = lazy(() => import('./components/TeaserModal'))

// Loading fallback
const SectionLoader = () => (
  <div className="py-8 px-4 md:px-12">
    <div className="h-6 w-48 bg-[#1a1a1a] rounded mb-4 animate-pulse" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="aspect-[2/3] bg-[#1a1a1a] rounded animate-pulse" />
      ))}
    </div>
  </div>
)

function App() {
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null)

  // Hero data - fetched once, passed to Hero component
  const [heroAnime, setHeroAnime] = useState<Anime[]>([])

  // Homepage data - NEVER overwritten by search
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([])
  const [popularAnime, setPopularAnime] = useState<Anime[]>([])
  const [topAnime, setTopAnime] = useState<Anime[]>([])
  const [upcomingAnime, setUpcomingAnime] = useState<Anime[]>([])
  const [actionAnime, setActionAnime] = useState<Anime[]>([])

  // Search state - null = HOME MODE, [] or [...] = SEARCH MODE
  const [searchResults, setSearchResults] = useState<Anime[] | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Loading states for individual sections
  const [loadingTrending, setLoadingTrending] = useState(true)
  const [loadingPopular, setLoadingPopular] = useState(true)
  const [loadingTop, setLoadingTop] = useState(true)
  const [loadingUpcoming, setLoadingUpcoming] = useState(true)
  const [loadingAction, setLoadingAction] = useState(true)

  // Error states
  const [errorTrending, setErrorTrending] = useState<string | null>(null)
  const [errorPopular, setErrorPopular] = useState<string | null>(null)
  const [errorTop, setErrorTop] = useState<string | null>(null)
  const [errorUpcoming, setErrorUpcoming] = useState<string | null>(null)
  const [errorAction, setErrorAction] = useState<string | null>(null)

  // Derived state
  const isSearchMode = searchResults !== null
  const showNoResults = isSearchMode && searchResults.length === 0 && !searchLoading

  // Load all data once at parent level
  useEffect(() => {
    const loadAllData = async () => {
      // Fetch hero data first (priority)
      try {
        const hero = await fetchTopAnime(6)
        setHeroAnime(hero)
      } catch {
        console.error('Failed to load hero data')
      }

      // Fetch trending
      try {
        setLoadingTrending(true)
        const trending = await fetchTrendingAnime(12)
        setTrendingAnime(trending)
        setErrorTrending(null)
      } catch {
        setErrorTrending('Failed to load')
      } finally {
        setLoadingTrending(false)
      }

      await new Promise((r) => setTimeout(r, 400))

      // Fetch popular
      try {
        setLoadingPopular(true)
        const popular = await fetchPopularAnime(12)
        setPopularAnime(popular)
        setErrorPopular(null)
      } catch {
        setErrorPopular('Failed to load')
      } finally {
        setLoadingPopular(false)
      }

      await new Promise((r) => setTimeout(r, 400))

      // Fetch top anime
      try {
        setLoadingTop(true)
        const top = await fetchTopAnime(12)
        setTopAnime(top)
        setErrorTop(null)
      } catch {
        setErrorTop('Failed to load')
      } finally {
        setLoadingTop(false)
      }

      await new Promise((r) => setTimeout(r, 400))

      // Fetch upcoming
      try {
        setLoadingUpcoming(true)
        const upcoming = await fetchUpcomingAnime(12)
        setUpcomingAnime(upcoming)
        setErrorUpcoming(null)
      } catch {
        setErrorUpcoming('Failed to load')
      } finally {
        setLoadingUpcoming(false)
      }

      await new Promise((r) => setTimeout(r, 400))

      // Fetch action anime
      try {
        setLoadingAction(true)
        const action = await fetchAnimeByGenre(1, 12)
        setActionAnime(action)
        setErrorAction(null)
      } catch {
        setErrorAction('Failed to load')
      } finally {
        setLoadingAction(false)
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

      {/* Hero Section - relative positioning, data passed from parent */}
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
            {/* Content overlaps Hero with negative margin and higher z-index */}
            <main className="relative z-20 -mt-24 space-y-2 bg-gradient-to-b from-transparent via-[#0f0f0f] to-[#0f0f0f]">
              <AnimeRow
                title="Trending Now"
                animeList={trendingAnime}
                isLoading={loadingTrending}
                error={errorTrending}
                onPosterClick={handlePosterClick}
              />
              <AnimeRow
                title="Popular on MangaVerse"
                animeList={popularAnime}
                isLoading={loadingPopular}
                error={errorPopular}
                onPosterClick={handlePosterClick}
              />
              <AnimeRow
                title="Top Rated"
                animeList={topAnime}
                isLoading={loadingTop}
                error={errorTop}
                onPosterClick={handlePosterClick}
              />
              <AnimeRow
                title="New Releases"
                animeList={upcomingAnime}
                isLoading={loadingUpcoming}
                error={errorUpcoming}
                onPosterClick={handlePosterClick}
              />
              <AnimeRow
                title="Action & Adventure"
                animeList={actionAnime}
                isLoading={loadingAction}
                error={errorAction}
                onPosterClick={handlePosterClick}
              />
            </main>

            {/* WatchingNow and Recommendations */}
            <Suspense fallback={<SectionLoader />}>
              <WatchingNow
                animeList={trendingAnime.slice(0, 6)}
                isLoading={loadingTrending}
              />
            </Suspense>

            <Suspense fallback={<SectionLoader />}>
              <Recommendations
                animeList={topAnime.slice(0, 8)}
                isLoading={loadingTop}
                onPosterClick={handlePosterClick}
              />
            </Suspense>

            <Suspense fallback={<SectionLoader />}>
              <PeopleAlsoSearch />
            </Suspense>
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
