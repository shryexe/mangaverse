import { memo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Plus, ThumbsUp, Volume2 } from 'lucide-react'
import { Anime } from '../types/anime'
import { getAnimePosterUrl, PLACEHOLDER_IMAGE } from '../utils/imageUtils'

interface TeaserModalProps {
  anime: Anime | null
  onClose: () => void
}

const TeaserModal = memo(({ anime, onClose }: TeaserModalProps) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (anime) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [anime])

  if (!anime) return null

  const posterUrl = getAnimePosterUrl(anime) || PLACEHOLDER_IMAGE

  return (
    <AnimatePresence>
      {anime && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-3xl bg-[#181818] rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#181818] flex items-center justify-center"
            >
              <X size={24} className="text-white" />
            </motion.button>

            {/* Hero Image */}
            <div className="relative aspect-video">
              <img
                src={posterUrl}
                alt={anime.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER_IMAGE
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />

              {/* Volume Button */}
              <button className="absolute bottom-4 right-4 w-10 h-10 rounded-full border border-gray-500 flex items-center justify-center hover:border-white transition-colors">
                <Volume2 size={20} className="text-white" />
              </button>

              {/* Content Overlay */}
              <div className="absolute bottom-4 left-4 right-20">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {anime.title}
                </h2>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-2 bg-white text-black font-semibold rounded"
                  >
                    <Play size={20} fill="black" />
                    Play
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white transition-colors"
                  >
                    <Plus size={20} className="text-white" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white transition-colors"
                  >
                    <ThumbsUp size={18} className="text-white" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-6">
              {/* Meta Info */}
              <div className="flex items-center gap-3 mb-4 text-sm">
                {anime.rating && (
                  <span className="text-green-500 font-semibold">
                    {Math.round(anime.rating * 10)}% Match
                  </span>
                )}
                {anime.year && <span className="text-gray-400">{anime.year}</span>}
                {anime.episodes && (
                  <span className="px-2 py-0.5 border border-gray-600 text-gray-400 text-xs">
                    {anime.episodes} Episodes
                  </span>
                )}
                {anime.status && (
                  <span className="text-gray-400">{anime.status}</span>
                )}
              </div>

              {/* Synopsis */}
              {anime.summary && (
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {anime.summary}
                </p>
              )}

              {/* Genres */}
              {anime.genre && anime.genre.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-gray-500 text-sm">Genres:</span>
                  {anime.genre.map((g, i) => (
                    <span key={i} className="text-white text-sm">
                      {g}{i < anime.genre!.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

TeaserModal.displayName = 'TeaserModal'

export default TeaserModal
