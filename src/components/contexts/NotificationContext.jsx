import React, { createContext, useContext, useState } from 'react'

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'EPI Expiré',
      message: '5 équipements arrivent à expiration cette semaine',
      read: false,
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      type: 'danger',
      title: 'Stock Critique',
      message: 'Stock de casques de sécurité inférieur à 10 unités',
      read: false,
      timestamp: new Date().toISOString()
    },
    {
      id: 3,
      type: 'info',
      title: 'Rapport Généré',
      message: 'Le rapport journalier HSE a été généré avec succès',
      read: true,
      timestamp: new Date().toISOString()
    }
  ])

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      read: false,
      timestamp: new Date().toISOString()
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    unreadCount
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
