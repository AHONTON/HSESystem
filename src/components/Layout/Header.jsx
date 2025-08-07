import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Moon, Sun, User, LogOut, Settings, Shield, Menu } from 'lucide-react'

const Header = () => {
  // États simulés pour la démo
  const [isDark, setIsDark] = useState(false)
  const [unreadCount] = useState(3)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  
  const user = {
    name: "Jean Dupont",
    email: "jean.dupont@hse.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format"
  }

  const toggleTheme = () => setIsDark(!isDark)
  const logout = () => console.log('Déconnexion')

  const notifications = [
    { id: 1, title: "Nouvelle alerte sécurité", message: "Incident signalé en zone A", time: "Il y a 5 min" },
    { id: 2, title: "Rapport mensuel", message: "Le rapport HSE est disponible", time: "Il y a 1h" },
    { id: 3, title: "Formation obligatoire", message: "Nouvelle formation disponible", time: "Il y a 2h" }
  ]

  const backgroundGradient = isDark 
    ? "bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900"
    : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700"

  return (
    <div className={`w-full ${isDark ? 'dark' : ''}`}>
      <header className={`relative w-full ${backgroundGradient} shadow-2xl border-b border-white/10`}>
        {/* Effet de particules en arrière-plan */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-10 opacity-30">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, -100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between px-8 py-6">
          {/* Logo et titre */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="p-2 bg-white/20 backdrop-blur-sm rounded-xl"
              whileHover={{ scale: 1.05, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Tableau de bord HSE
              </h1>
              <p className="text-sm text-white/80">
                Santé, Sécurité & Environnement
              </p>
            </div>
          </motion.div>

          {/* Actions utilisateur */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Toggle thème */}
            <motion.button
              onClick={toggleTheme}
              className="p-3 transition-all duration-300 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-300 drop-shadow-sm" />
                ) : (
                  <Moon className="w-5 h-5 text-white drop-shadow-sm" />
                )}
              </motion.div>
            </motion.button>

            {/* Notifications */}
            <div className="relative z-50">
              <motion.button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 transition-all duration-300 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5 text-white drop-shadow-sm" />
                {unreadCount > 0 && (
                  <motion.span
                    className="absolute flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full shadow-lg -top-1 -right-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {unreadCount}
                    </motion.span>
                  </motion.span>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    className="absolute right-0 top-full z-[100] w-80 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-600 overflow-hidden"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{ filter: 'none', backdropFilter: 'none' }}
                  >
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600">
                      <h3 className="text-lg font-semibold text-white drop-shadow-sm">Notifications</h3>
                    </div>
                    <div className="overflow-y-auto bg-white max-h-64 dark:bg-slate-800">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          className="p-4 border-b border-gray-100 cursor-pointer dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
                          whileHover={{ x: 5 }}
                        >
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </h4>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            {notification.message}
                          </p>
                          <p className="mt-2 text-xs text-gray-400">
                            {notification.time}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200 bg-gray-50 dark:bg-slate-700 dark:border-slate-600">
                      <button className="w-full text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        Voir toutes les notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profil utilisateur */}
            <div className="relative z-50">
              <motion.button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center p-2 pr-4 space-x-3 transition-all duration-300 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="w-10 h-10 overflow-hidden rounded-full ring-2 ring-white/30"
                  whileHover={{ scale: 1.1 }}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="object-cover w-full h-full filter-none"
                    loading="eager"
                  />
                </motion.div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white drop-shadow-sm">
                    {user.name}
                  </p>
                  <p className="text-xs text-white/90 drop-shadow-sm">
                    En ligne
                  </p>
                </div>
              </motion.button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    className="absolute right-0 top-full z-[100] w-56 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-600 overflow-hidden backdrop-blur-none"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{ filter: 'none', backdropFilter: 'none' }}
                  >
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-full ring-2 ring-white/30 filter-none"
                          loading="eager"
                        />
                        <div>
                          <p className="font-semibold text-white drop-shadow-sm">{user.name}</p>
                          <p className="text-sm text-white/90 drop-shadow-sm">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2 bg-white dark:bg-slate-800">
                      <motion.button 
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-800 transition-colors dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-slate-700"
                        whileHover={{ x: 5 }}
                      >
                        <User className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
                        Mon Profil
                      </motion.button>
                      
                      <motion.button 
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-800 transition-colors dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-slate-700"
                        whileHover={{ x: 5 }}
                      >
                        <Settings className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
                        Paramètres
                      </motion.button>
                      
                      <hr className="my-2 border-gray-200 dark:border-slate-600" />
                      
                      <motion.button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 transition-colors dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700"
                        whileHover={{ x: 5 }}
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        Déconnexion
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Indicateur de statut */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </header>

      {/* Overlay pour fermer les dropdowns */}
      <AnimatePresence>
        {(showNotifications || showProfile) && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowNotifications(false)
              setShowProfile(false)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Header