import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, User, Menu, X } from 'lucide-react'
import SearchBar from './SearchBar'

interface HeaderProps {
  onSearch: (query: string) => void
  onClearSearch: () => void
}

const Header = ({ onSearch, onClearSearch }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`
        fixed top-0 left-0 right-0 z-50 
        transition-all duration-500
        ${scrolled 
          ? 'bg-[#0f0f0f]/95 backdrop-blur-md shadow-lg' 
          : 'bg-gradient-to-b from-black/80 to-transparent'
        }
      `}
    >
      <nav className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wider"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-red-600">MANGA</span>VERSE
        </motion.div>
        
        {/* Navigation Links - Desktop */}
        <div className="hidden lg:flex items-center space-x-8">
          {['Home', 'Series', 'Genres', 'My List'].map((link) => (
            <motion.a
              key={link}
              href="#"
              className="text-gray-300 hover:text-white transition-colors font-medium text-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {link}
            </motion.a>
          ))}
        </div>
        
        {/* Right Side - Search, Notifications, Profile */}
        <div className="flex items-center space-x-4">
          {/* Search Bar - Desktop */}
          <div className="hidden md:block w-64">
            <SearchBar onSearch={onSearch} onClear={onClearSearch} />
          </div>

          {/* Notification Bell */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 text-gray-300 hover:text-white transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
          </motion.button>

          {/* User Avatar */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center"
          >
            <User size={18} className="text-white" />
          </motion.button>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-[#0f0f0f] border-t border-gray-800"
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            <div className="md:hidden">
              <SearchBar onSearch={onSearch} onClear={onClearSearch} />
            </div>
            {['Home', 'Series', 'Genres', 'My List'].map((link) => (
              <a
                key={link}
                href="#"
                className="block text-gray-300 hover:text-white transition-colors py-2"
              >
                {link}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}

export default Header
