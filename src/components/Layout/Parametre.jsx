import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LangContext'

const Parametre = ({ isOpen, onClose, onDeleteAccount }) => {
  const { isDark, toggleTheme } = useTheme()
  const { lang, toggleLang } = useLang()

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-sm p-6 bg-white rounded-lg dark:bg-gray-800"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          {lang === 'fr' ? 'Paramètres' : 'Settings'}
        </h2>

        <div className="mb-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isDark}
              onChange={toggleTheme}
              className="w-5 h-5 rounded"
            />
            <span className="text-gray-700 dark:text-gray-300">
              {lang === 'fr' ? 'Mode sombre' : 'Dark mode'}
            </span>
          </label>
        </div>

        <div className="mb-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <span className="text-gray-700 dark:text-gray-300">{lang === 'fr' ? 'Langue :' : 'Language :'}</span>
            <button
              onClick={toggleLang}
              className="px-3 py-1 ml-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              {lang === 'fr' ? 'FR' : 'EN'}
            </button>
          </label>
        </div>

        <div className="mt-6">
          <button
            onClick={onDeleteAccount}
            className="w-full px-4 py-2 font-semibold text-white bg-red-600 rounded hover:bg-red-700"
          >
            {lang === 'fr' ? 'Supprimer mon compte' : 'Delete my account'}
          </button>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-300 rounded hover:bg-gray-400"
          >
            {lang === 'fr' ? 'Fermer' : 'Close'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Parametre
