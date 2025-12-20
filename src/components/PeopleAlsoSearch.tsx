import { memo } from 'react'
import { motion } from 'framer-motion'

const searchTags = [
  'Attack on Titan', 'Demon Slayer', 'One Piece', 'Naruto', 'Jujutsu Kaisen',
  'My Hero Academia', 'Death Note', 'Fullmetal Alchemist', 'Hunter x Hunter',
  'Dragon Ball', 'Spy x Family', 'Chainsaw Man', 'Bleach', 'One Punch Man',
  'Tokyo Revengers', 'Black Clover', 'Mob Psycho 100', 'Vinland Saga'
]

const PeopleAlsoSearch = memo(() => {
  return (
    <section className="px-4 md:px-12 lg:px-16 py-8 bg-[#0a0a0a]">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-lg md:text-xl font-semibold text-white mb-4"
      >
        People Also Search
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex flex-wrap gap-2"
      >
        {searchTags.map((tag, index) => (
          <motion.button
            key={tag}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-[#1a1a1a] text-gray-300 text-sm rounded-full border border-gray-800 hover:border-red-500/50 hover:text-white transition-colors"
          >
            {tag}
          </motion.button>
        ))}
      </motion.div>
    </section>
  )
})

PeopleAlsoSearch.displayName = 'PeopleAlsoSearch'

export default PeopleAlsoSearch
