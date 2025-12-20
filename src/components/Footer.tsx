import { memo } from 'react'
import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

const Footer = memo(() => {
  const footerLinks = {
    About: ['Company', 'Careers', 'Press', 'Blog'],
    Help: ['FAQ', 'Contact Us', 'Account', 'Devices'],
    Legal: ['Terms of Use', 'Privacy Policy', 'Cookie Preferences', 'Corporate Info'],
    Connect: ['Facebook', 'Twitter', 'Instagram', 'YouTube']
  }

  return (
    <footer className="bg-[#0a0a0a] border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-12 lg:px-16 py-12">
        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex gap-4 mb-8"
        >
          {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
            <motion.a
              key={index}
              href="#"
              whileHover={{ scale: 1.2, color: '#ef4444' }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Icon size={24} />
            </motion.a>
          ))}
        </motion.div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Service Code Button */}
        <motion.button
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="px-4 py-2 border border-gray-700 text-gray-500 text-sm hover:text-white hover:border-gray-500 transition-colors mb-6"
        >
          Service Code
        </motion.button>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-gray-600 text-sm"
        >
          © 2024 MangaVerse. All rights reserved.
        </motion.p>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'

export default Footer
