import { memo } from 'react'
import { motion } from 'framer-motion'
import { Anime } from '../types/anime'
import AnimeCard from './AnimeCard'

interface AnimeGridProps {
  title: string
  animeList: Anime[]
  isLoading?: boolean
  error?: string | null
  onPosterClick?: (anime: Anime) => void
}

const AnimeGrid = memo(({
  title,
  animeList,
  isLoading = false,
  error = null,
  onPosterClick
}: AnimeGridProps) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="px-4 md:px-12 lg:px-16 py-8 min-h-[50vh]">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-[#1a1a1a] rounded-md animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="px-4 md:px-12 lg:px-16 py-8 min-h-[50vh]">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">{title}</h2>
        <div className="text-center py-16 text-red-400">
          <p className="text-lg">Failed to load anime. Please try again.</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (!animeList || animeList.length === 0) {
    return (
      <div className="px-4 md:px-12 lg:px-16 py-8 min-h-[50vh]">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">{title}</h2>
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No anime found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 md:px-12 lg:px-16 py-8 min-h-[50vh]">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl md:text-3xl font-semibold text-white mb-6"
      >
        {title}
      </motion.h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {animeList.map((anime, index) => (
          <motion.div
            key={anime.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <AnimeCard anime={anime} onPosterClick={onPosterClick} />
          </motion.div>
        ))}
      </div>
    </div>
  )
})

AnimeGrid.displayName = 'AnimeGrid'

export default AnimeGrid
