import { useRef, memo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Anime } from '../types/anime'
import AnimeCard from './AnimeCard'

interface AnimeRowProps {
  title: string
  animeList: Anime[]
  isLoading?: boolean
  error?: string | null
  onPosterClick?: (anime: Anime) => void
}

const AnimeRow = memo(({
  title,
  animeList,
  isLoading = false,
  error = null,
  onPosterClick
}: AnimeRowProps) => {
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
      <section className="relative px-4 md:px-12 lg:px-16 py-6">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">{title}</h2>
        <div className="flex space-x-3 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-36 md:w-44 aspect-[2/3] bg-[#1a1a1a] rounded-md animate-pulse"
            />
          ))}
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className="relative px-4 md:px-12 lg:px-16 py-6">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">{title}</h2>
        <div className="text-center py-8 text-red-400">
          <p>Failed to load. Please try again.</p>
        </div>
      </section>
    )
  }

  // Empty state
  if (!animeList || animeList.length === 0) {
    return null
  }

  return (
    <section className="relative px-4 md:px-12 lg:px-16 py-4 group/row">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center gap-2"
      >
        {title}
        <ChevronRight size={20} className="text-red-500 opacity-0 group-hover/row:opacity-100 transition-opacity" />
      </motion.h2>

      <div className="relative">
        {/* Left Scroll Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: showLeftArrow ? 1 : 0 }}
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-r from-[#0f0f0f] to-transparent flex items-center justify-start pl-1 opacity-0 group-hover/row:opacity-100 transition-opacity"
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
          className="flex space-x-3 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        >
          {animeList.map((anime, index) => (
            <motion.div
              key={anime.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0 w-36 md:w-44"
            >
              <AnimeCard anime={anime} onPosterClick={onPosterClick} />
            </motion.div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: showRightArrow ? 1 : 0 }}
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-l from-[#0f0f0f] to-transparent flex items-center justify-end pr-1 opacity-0 group-hover/row:opacity-100 transition-opacity"
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

AnimeRow.displayName = 'AnimeRow'

export default AnimeRow
