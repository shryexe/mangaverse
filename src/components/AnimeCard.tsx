import { memo, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Plus, ThumbsUp } from 'lucide-react'
import { Anime } from '../types/anime'
import { getAnimePosterUrl, PLACEHOLDER_IMAGE } from '../utils/imageUtils'

interface AnimeCardProps {
  anime: Anime
  onPosterClick?: (anime: Anime) => void
}

const AnimeCard = memo(({ anime, onPosterClick }: AnimeCardProps) => {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (onPosterClick) {
      onPosterClick(anime)
    }
  }

  const posterUrl = imageError ? PLACEHOLDER_IMAGE : getAnimePosterUrl(anime)

  return (
    <motion.div
      className="relative group cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative overflow-hidden rounded-md bg-[#1a1a1a]">
        {/* Poster Image */}
        <div className="relative w-full aspect-[2/3] overflow-hidden">
          <img
            src={posterUrl}
            alt={anime.title || 'Anime poster'}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
          
          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
          />
        </div>

        {/* Hover Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-0 left-0 right-0 p-3"
        >
          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 mb-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center"
            >
              <Play size={16} fill="black" className="text-black ml-0.5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-full bg-[#2a2a2a] border border-gray-600 flex items-center justify-center"
            >
              <Plus size={16} className="text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-full bg-[#2a2a2a] border border-gray-600 flex items-center justify-center"
            >
              <ThumbsUp size={14} className="text-white" />
            </motion.button>
          </div>

          {/* Title */}
          <h3 className="text-white text-sm font-semibold line-clamp-1 mb-1">
            {anime.title || 'Unknown Title'}
          </h3>

          {/* Meta Info */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {anime.rating && (
              <span className="text-green-500 font-medium">{Math.round(anime.rating * 10)}% Match</span>
            )}
            {anime.year && <span>{anime.year}</span>}
            {anime.episodes && <span>{anime.episodes} eps</span>}
          </div>

          {/* Genres */}
          {anime.genre && anime.genre.length > 0 && (
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
              {anime.genre.slice(0, 2).map((g, i) => (
                <span key={i}>
                  {g}{i < Math.min(anime.genre!.length - 1, 1) ? ' •' : ''}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
})

AnimeCard.displayName = 'AnimeCard'

export default AnimeCard
