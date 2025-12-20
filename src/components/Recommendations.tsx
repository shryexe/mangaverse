import { memo } from 'react'
import { motion } from 'framer-motion'
import { Star, Clock, Tv, TrendingUp } from 'lucide-react'
import { Anime } from '../types/anime'
import { getAnimePosterUrl, PLACEHOLDER_IMAGE } from '../utils/imageUtils'

interface RecommendationsProps {
  animeList: Anime[]
  isLoading?: boolean
  onPosterClick?: (anime: Anime) => void
}

const Recommendations = memo(({ animeList, isLoading = false, onPosterClick }: RecommendationsProps) => {
  // Loading state
  if (isLoading) {
    return (
      <section className="px-4 md:px-12 lg:px-16 py-10 bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a]">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-red-500" size={24} />
          <h2 className="text-xl md:text-2xl font-semibold text-white">Top Recommendations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[420px] bg-[#1a1a1a] rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  // Empty state
  if (!animeList || animeList.length === 0) {
    return null
  }

  const getStatus = (index: number) => {
    return index % 3 === 0 ? 'Completed' : 'Ongoing'
  }

  return (
    <section className="px-4 md:px-12 lg:px-16 py-10 bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a]">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-2 mb-6"
      >
        <TrendingUp className="text-red-500" size={24} />
        <h2 className="text-xl md:text-2xl font-semibold text-white">Top Recommendations</h2>
      </motion.div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {animeList.slice(0, 8).map((anime, index) => {
          const status = getStatus(index)
          const posterUrl = getAnimePosterUrl(anime)

          return (
            <motion.div
              key={anime.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
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
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={posterUrl}
                    alt={anime.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER_IMAGE
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Title */}
                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">
                    {anime.title}
                  </h3>

                  {/* Rating, Year, Status */}
                  <div className="flex items-center gap-3 mb-3">
                    {anime.rating && (
                      <span className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                        <Star size={14} fill="currentColor" />
                        {anime.rating.toFixed(1)}
                      </span>
                    )}
                    {anime.year && (
                      <span className="text-gray-400 text-sm">{anime.year}</span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      status === 'Ongoing' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {status}
                    </span>
                  </div>

                  {/* Hours & Episodes */}
                  <div className="flex items-center gap-4 mb-3 text-gray-400 text-sm">
                    {anime.hours && (
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {anime.hours}h
                      </span>
                    )}
                    {anime.episodes && (
                      <span className="flex items-center gap-1">
                        <Tv size={14} />
                        {anime.episodes} Episodes
                      </span>
                    )}
                  </div>

                  {/* Genre Tags */}
                  {anime.genre && anime.genre.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {anime.genre.slice(0, 3).map((g, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-[#2a2a2a] text-gray-300 text-xs rounded border border-gray-700"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  {anime.description && (
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {anime.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
})

Recommendations.displayName = 'Recommendations'

export default Recommendations
