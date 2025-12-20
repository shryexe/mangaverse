import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
  onClear: () => void
}

const SearchBar = ({ onSearch, onClear }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    
    if (value.trim().length === 0) {
      onClear()
    }
  }, [onClear])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim().length > 0) {
      onSearch(searchQuery.trim())
    }
    if (e.key === 'Escape') {
      setSearchQuery('')
      onClear()
    }
  }, [searchQuery, onSearch, onClear])

  const handleClear = useCallback(() => {
    setSearchQuery('')
    onClear()
  }, [onClear])

  return (
    <motion.div
      animate={{ 
        scale: isFocused ? 1.02 : 1,
        boxShadow: isFocused ? '0 0 20px rgba(239, 68, 68, 0.2)' : '0 0 0px rgba(0,0,0,0)'
      }}
      className={`
        relative flex items-center
        bg-[#1a1a1a] border
        ${isFocused ? 'border-red-500/50' : 'border-gray-700'}
        rounded-full px-4 py-2
        transition-colors duration-300
      `}
    >
      <Search size={18} className={`${isFocused ? 'text-red-500' : 'text-gray-500'} transition-colors`} />
      
      <input
        type="text"
        value={searchQuery}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search anime..."
        className="
          flex-1 ml-3
          bg-transparent border-none outline-none
          text-white placeholder-gray-500
          text-sm
        "
      />

      {searchQuery.length > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleClear}
          className="ml-2 text-gray-500 hover:text-white transition-colors"
          type="button"
        >
          <X size={16} />
        </motion.button>
      )}
    </motion.div>
  )
}

export default SearchBar
