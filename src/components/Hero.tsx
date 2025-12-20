import { memo } from 'react'
import { motion } from 'framer-motion'
import { Play, Info } from 'lucide-react'
import { Anime } from '../types/anime'
import { getAnimePosterUrl } from '../utils/imageUtils'

interface HeroProps {
  // Hero background anime (6 posters for collage)
  heroAnime: Anime[]
  // Featured anime to display in foreground
  featuredAnime?: Anime | null
  // Search mode override
  searchFeaturedAnime?: Anime | null
  isSearchMode?: boolean
}

const Hero = memo(({ heroAnime, featuredAnime, searchFeaturedAnime, isSearchMode = false }: HeroProps) => {
  // Determine which anime to feature in foreground
  // Priority: searchFeaturedAnime > featuredAnime > heroAnime[0]
  const displayAnime = isSearchMode && searchFeaturedAnime 
    ? searchFeaturedAnime 
    : featuredAnime || heroAnime[0]

  return (
    <section className="relative z-10 min-h-[70vh] md:min-h-[80vh] w-full overflow-hidden bg-[#0f0f0f]">
      {/* Background Image Collage - Always render even if empty */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 scale-110">
          {heroAnime.length > 0 ? (
            heroAnime.slice(0, 6).map((anime, index) => (
              <div
                key={anime.id || index}
                className="w-full h-full bg-cover bg-center bg-[#1a1a1a]"
                style={{
                  backgroundImage: `url(${getAnimePosterUrl(anime)})`
                }}
              />
            ))
          ) : (
            // Placeholder grid - prevents layout shift
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="w-full h-full bg-[#1a1a1a]" />
            ))
          )}
        </div>

        {/* Blur & Dark Overlay */}
        <div className="absolute inset-0 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/70 to-[#0f0f0f]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/90 via-[#0f0f0f]/40 to-transparent" />
      </div>

      {/* Content - Always render structure */}
      <div className="relative z-10 h-full min-h-[70vh] md:min-h-[80vh] flex items-end px-4 sm:px-6 md:px-12 lg:px-16 pb-24 md:pb-32">
        <div className="max-w-2xl">
          {displayAnime ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              key={displayAnime.id} // Re-animate when anime changes
            >
              {/* Search Mode Badge */}
              {isSearchMode && (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-block px-3 py-1 bg-red-600/20 text-red-500 text-xs font-semibold rounded-full mb-4 border border-red-600/30"
                >
                  Top Search Result
                </motion.span>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                {displayAnime.title}
              </h1>

              {/* Metadata Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {displayAnime.genre?.slice(0, 3).map((g, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-full border border-white/20"
                  >
                    {g}
                  </span>
                ))}
                {displayAnime.year && (
                  <span className="text-gray-400 text-sm">| {displayAnime.year}</span>
                )}
                {displayAnime.hours && (
                  <span className="text-gray-400 text-sm">| {displayAnime.hours}h</span>
                )}
                {displayAnime.rating && (
                  <span className="flex items-center text-yellow-500 text-sm font-medium">
                    | ⭐ {displayAnime.rating.toFixed(1)}
                  </span>
                )}
              </div>

              {/* Synopsis */}
              {displayAnime.summary && (
                <p className="text-gray-300 text-sm md:text-base mb-6 max-w-xl leading-relaxed line-clamp-3">
                  {displayAnime.summary}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded hover:bg-gray-200 transition-colors"
                >
                  <Play size={20} fill="black" />
                  Play
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600/50 text-white font-semibold rounded hover:bg-gray-600/70 transition-colors border border-gray-500/30"
                >
                  <Info size={20} />
                  More Info
                </motion.button>
              </div>
            </motion.div>
          ) : (
            // Fallback content - always visible
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">MangaVerse</h1>
              <p className="text-gray-400 text-lg">Your ultimate anime streaming destination</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
})

Hero.displayName = 'Hero'

export default Hero
