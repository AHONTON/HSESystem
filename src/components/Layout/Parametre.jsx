import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LangContext'

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
}

const modal = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
}

const Parametre = ({ isOpen, onClose, onDeleteAccount }) => {
  const { isDark, toggleTheme } = useTheme()
  const { lang, toggleLang } = useLang()

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-sm p-6 bg-white shadow-lg rounded-xl dark:bg-gray-800"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              {lang === 'fr' ? 'Paramètres' : 'Settings'}
            </h2>

            {/* Thème */}
            <div className="mb-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDark}
                  onChange={toggleTheme}
                  className="w-5 h-5 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-800 dark:text-gray-200">
                  {lang === 'fr' ? 'Mode sombre' : 'Dark mode'}
                </span>
              </label>
            </div>

            {/* Langue */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-800 dark:text-gray-200">
                  {lang === 'fr' ? 'Langue :' : 'Language :'}
                </span>
                <button
                  onClick={toggleLang}
                  className="px-3 py-1 text-white transition bg-blue-600 rounded hover:bg-blue-700"
                >
                  {lang === 'fr' ? 'FR' : 'EN'}
                </button>
              </div>
            </div>

            {/* Suppression */}
            <div className="mt-6">
              <button
                onClick={onDeleteAccount}
                className="w-full px-4 py-2 font-semibold text-white transition bg-red-600 rounded hover:bg-red-700"
              >
                {lang === 'fr' ? 'Supprimer mon compte' : 'Delete my account'}
              </button>
            </div>

            {/* Bouton Fermer */}
            <div className="flex justify-end mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 transition bg-gray-300 rounded hover:bg-gray-400"
              >
                {lang === 'fr' ? 'Fermer' : 'Close'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Parametre
