import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Users, HardHat, Package, AlertTriangle,
  FileText, BarChart3, GraduationCap, ChevronLeft, ChevronRight
} from 'lucide-react'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/users', icon: Users, label: 'Utilisateurs' },
    { path: '/technicians', icon: HardHat, label: 'Techniciens & EPI' },
    { path: '/epi-stock', icon: Package, label: 'Stock EPI' },
    { path: '/incidents', icon: AlertTriangle, label: 'Incidents & Activités' },
    { path: '/reports', icon: FileText, label: 'Rapports' },
    { path: '/statistics', icon: BarChart3, label: 'Statistiques' },
    { path: '/training', icon: GraduationCap, label: 'Formations' },
  ]

  return (
    <motion.div
      className={`h-screen sticky top-0 bg-white dark:bg-gray-900 shadow-md transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <motion.h1
            className="text-xl font-bold text-gray-800 dark:text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            HSE Tracker
          </motion.h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 mt-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                className={`flex items-center px-3 py-2 rounded-md cursor-pointer transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!isCollapsed && (
                  <motion.span
                    className="ml-3 text-sm font-medium truncate"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>
    </motion.div>
  )
}

export default Sidebar
