import { memo } from 'react'
import { motion } from 'framer-motion'
import { Anime } from '../types/anime'
import { getAnimePosterUrl, PLACEHOLDER_IMAGE } from '../utils/imageUtils'

interface WatchingNowProps {
  animeList: Anime[]
  isLoading?: boolean
}

const WatchingNow = memo(({ animeList, isLoading = false }: WatchingNowProps) => {
  // Simulated watch progress
  const getWatchProgress = (index: number) => {
    const progresses = [75, 45, 60, 30, 85, 50]
    return progresses[index % progresses.length]
  }

  // Loading state
  if (isLoading) {
    return (
      <section className="relative z-20 px-4 md:px-12 lg:px-16 py-10 bg-[#0f0f0f]">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">Watching Now</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-[#1a1a1a] rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  // Use animeList or empty array
  const displayList = animeList && animeList.length > 0 ? animeList.slice(0, 6) : []

  // Always show section - with loading state if empty
  if (displayList.length === 0 && !isLoading) {
    return (
      <section className="relative z-20 px-4 md:px-12 lg:px-16 py-10 bg-[#0f0f0f]">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">Watching Now</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-[#1a1a1a] rounded-lg animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="relative z-20 px-4 md:px-12 lg:px-16 py-10 bg-[#0f0f0f]">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="text-xl md:text-2xl font-semibold text-white mb-6"
      >
        Watching Now
      </motion.h2>

      {/* 3D Grid Container */}
      <div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
        style={{ perspective: '1000px' }}
      >
        {displayList.map((anime, index) => {
          const progress = getWatchProgress(index)
          const posterUrl = getAnimePosterUrl(anime)

          return (
            <motion.div
              key={anime.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* 3D Tilt Card */}
              <motion.div
                whileHover={{ 
                  rotateY: 15, 
                  rotateX: -10, 
                  scale: 1.05,
                  z: 50
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative rounded-lg overflow-hidden bg-[#1a1a1a] border border-gray-800 hover:border-red-500/50 shadow-xl"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Poster Image */}
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={posterUrl}
                    alt={anime.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER_IMAGE
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    {/* Title */}
                    <p className="text-white text-sm font-medium line-clamp-1 mb-2">
                      {anime.title}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                      />
                    </div>
                    <p className="text-gray-400 text-xs mt-1">{progress}% watched</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
})

WatchingNow.displayName = 'WatchingNow'

export default WatchingNow
