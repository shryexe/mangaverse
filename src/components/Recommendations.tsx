import { memo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react'
import { Anime } from '../types/anime'
import { getAnimePosterUrl, PLACEHOLDER_IMAGE } from '../utils/imageUtils'

interface RecommendationsProps {
  animeList: Anime[]
  isLoading?: boolean
  onPosterClick?: (anime: Anime) => void
}

const Recommendations = memo(({ animeList, isLoading = false, onPosterClick }: RecommendationsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <section className="relative z-20 px-4 md:px-12 lg:px-16 py-10 bg-[#0f0f0f]">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-red-500" size={24} />
          <h2 className="text-xl md:text-2xl font-semibold text-white">Top Recommendations</h2>
        </div>
        <div className="flex space-x-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48 md:w-56 aspect-[2/3] bg-[#1a1a1a] rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  // Always show section - with loading state if empty
  if (!animeList || animeList.length === 0) {
    return (
      <section className="relative z-20 px-4 md:px-12 lg:px-16 py-10 bg-[#0f0f0f]">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-red-500" size={24} />
          <h2 className="text-xl md:text-2xl font-semibold text-white">Top Recommendations</h2>
        </div>
        <div className="flex space-x-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48 md:w-56 aspect-[2/3] bg-[#1a1a1a] rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="relative z-20 px-4 md:px-12 lg:px-16 py-10 bg-[#0f0f0f]">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-2 mb-6"
      >
        <TrendingUp className="text-red-500" size={24} />
        <h2 className="text-xl md:text-2xl font-semibold text-white">Top Recommendations</h2>
        <ChevronRight size={20} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>

      {/* Horizontal Scroll Container */}
      <div className="relative group/row">
        {/* Left Scroll Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: showLeftArrow ? 1 : 0 }}
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-30 w-12 bg-gradient-to-r from-[#0f0f0f] to-transparent flex items-center justify-start pl-1 opacity-0 group-hover/row:opacity-100 transition-opacity"
          aria-label="Scroll left"
        >
          <div className="w-10 h-10 rounded-full bg-black/50 border border-gray-700 flex items-center justify-center hover:bg-black/80 transition-colors">
            <ChevronLeft size={24} className="text-white" />
          </div>
        </motion.button>

        {/* Scrollable Row */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {animeList.map((anime, index) => {
            const posterUrl = getAnimePosterUrl(anime)

            return (
              <motion.div
                key={anime.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className="flex-shrink-0 w-48 md:w-56 cursor-pointer group"
                onClick={() => onPosterClick?.(anime)}
              >
                <div className="relative bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800 hover:border-red-500/50 transition-colors">
                  {/* Rank Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-white text-sm shadow-lg">
                      {index + 1}
                    </div>
                  </div>

                  {/* Poster Image */}
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img
                      src={posterUrl}
                      alt={anime.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER_IMAGE
                      }}
                    />
                    
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content - Shows on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                      {anime.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-xs">
                      {anime.rating && (
                        <span className="flex items-center gap-1 text-yellow-500">
                          <Star size={12} fill="currentColor" />
                          {anime.rating.toFixed(1)}
                        </span>
                      )}
                      {anime.year && (
                        <span className="text-gray-400">{anime.year}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Right Scroll Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: showRightArrow ? 1 : 0 }}
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-30 w-12 bg-gradient-to-l from-[#0f0f0f] to-transparent flex items-center justify-end pr-1 opacity-0 group-hover/row:opacity-100 transition-opacity"
          aria-label="Scroll right"
        >
          <div className="w-10 h-10 rounded-full bg-black/50 border border-gray-700 flex items-center justify-center hover:bg-black/80 transition-colors">
            <ChevronRight size={24} className="text-white" />
          </div>
        </motion.button>
      </div>
    </section>
  )
})

Recommendations.displayName = 'Recommendations'

export default Recommendations
