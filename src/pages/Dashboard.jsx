import React from 'react'
import { motion } from 'framer-motion'
import {
  Users, AlertTriangle, Shield, TrendingUp,
  Calendar, Package, FileText, Activity
} from 'lucide-react'
import Card from '../components/UI/Card'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

const Dashboard = () => {
  const stats = [
    { title: 'Utilisateurs Actifs', value: '24', change: '+12%', changeType: 'positive', icon: Users, color: 'bg-primary-500' },
    { title: 'Incidents ce mois', value: '3', change: '-25%', changeType: 'positive', icon: AlertTriangle, color: 'bg-danger-500' },
    { title: 'EPI Expirés', value: '8', change: '+5%', changeType: 'negative', icon: Shield, color: 'bg-warning-500' },
    { title: 'Taux de Conformité', value: '94%', change: '+2%', changeType: 'positive', icon: TrendingUp, color: 'bg-success-500' }
  ]

  const monthlyIncidents = [
    { month: 'Jan', incidents: 5, formations: 12 },
    { month: 'Fév', incidents: 3, formations: 15 },
    { month: 'Mar', incidents: 7, formations: 10 },
    { month: 'Avr', incidents: 2, formations: 18 },
    { month: 'Mai', incidents: 4, formations: 14 },
    { month: 'Jun', incidents: 3, formations: 16 }
  ]

  const incidentTypes = [
    { name: 'Accidents', value: 45, color: '#ef4444' },
    { name: 'Incendies', value: 15, color: '#f59e0b' },
    { name: 'Environnement', value: 25, color: '#22c55e' },
    { name: 'Autres', value: 15, color: '#6b7280' }
  ]

  const recentActivities = [
    { id: 1, type: 'incident', title: 'Nouvel incident déclaré', description: 'Chute dans l\'atelier A', time: 'Il y a 2h', icon: AlertTriangle, color: 'text-danger-500' },
    { id: 2, type: 'formation', title: 'Formation terminée', description: 'Formation premiers secours - 8 participants', time: 'Il y a 4h', icon: Activity, color: 'text-success-500' },
    { id: 3, type: 'epi', title: 'EPI attribué', description: 'Casque de sécurité - Jean Martin', time: 'Il y a 6h', icon: Shield, color: 'text-primary-500' },
    { id: 4, type: 'rapport', title: 'Rapport généré', description: 'Rapport journalier HSE du 15/01/2024', time: 'Hier', icon: FileText, color: 'text-gray-500' }
  ]

  return (
    <motion.div
      className="flex flex-col w-full gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tableau de bord HSE
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Vue d'ensemble des indicateurs de sécurité et environnement
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                      <span className={`ml-2 text-sm font-medium ${stat.changeType === 'positive' ? 'text-success-600' : 'text-danger-600'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Évolution Mensuelle
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyIncidents}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="incidents" fill="#ef4444" name="Incidents" />
              <Bar dataKey="formations" fill="#22c55e" name="Formations" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Types d'Incidents
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incidentTypes}
                cx="50%" cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                dataKey="value"
              >
                {incidentTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Activités récentes */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Activités Récentes
          </h3>
          <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
            Voir tout
          </button>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <motion.div
                key={activity.id}
                className="flex items-center p-3 space-x-4 transition rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-700">
                  <Icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">{activity.description}</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">{activity.time}</span>
              </motion.div>
            )
          })}
        </div>
      </Card>

      {/* Actions rapides */}
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Actions Rapides
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { title: 'Déclarer Incident', icon: AlertTriangle, color: 'bg-danger-500' },
            { title: 'Attribuer EPI', icon: Shield, color: 'bg-primary-500' },
            { title: 'Planifier Formation', icon: Calendar, color: 'bg-success-500' },
            { title: 'Gérer Stock', icon: Package, color: 'bg-warning-500' }
          ].map((action, index) => {
            const Icon = action.icon
            return (
              <motion.button
                key={action.title}
                className="flex flex-col items-center p-4 transition border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className={`p-3 rounded-lg ${action.color} mb-2`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-center text-gray-700 dark:text-gray-300">
                  {action.title}
                </span>
              </motion.button>
            )
          })}
        </div>
      </Card>
    </motion.div>
  )
}

export default Dashboard
