import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { TrendingUp, TrendingDown, Calendar, Filter, Download } from 'lucide-react'
import Card from '../components/UI/Card'

const Statistics = () => {
  const [timeRange, setTimeRange] = useState('6months')
  const [selectedMetric, setSelectedMetric] = useState('incidents')

  // Données simulées pour les statistiques
  const monthlyData = [
    { month: 'Juil', incidents: 5, formations: 12, trir: 2.1, ltifr: 1.8 },
    { month: 'Août', incidents: 3, formations: 15, trir: 1.8, ltifr: 1.2 },
    { month: 'Sept', incidents: 7, formations: 10, trir: 2.8, ltifr: 2.1 },
    { month: 'Oct', incidents: 2, formations: 18, trir: 1.2, ltifr: 0.8 },
    { month: 'Nov', incidents: 4, formations: 14, trir: 1.9, ltifr: 1.5 },
    { month: 'Déc', incidents: 3, formations: 16, trir: 1.5, ltifr: 1.1 }
  ]

  const incidentsByType = [
    { name: 'Accidents', value: 45, color: '#ef4444' },
    { name: 'Incendies', value: 15, color: '#f59e0b' },
    { name: 'Environnement', value: 25, color: '#22c55e' },
    { name: 'Autres', value: 15, color: '#6b7280' }
  ]

  const departmentStats = [
    { department: 'Production', incidents: 12, formations: 25, conformity: 92 },
    { department: 'Maintenance', incidents: 8, formations: 18, conformity: 95 },
    { department: 'Logistique', incidents: 5, formations: 15, conformity: 88 },
    { department: 'Administration', incidents: 2, formations: 12, conformity: 98 }
  ]

  const kpiData = [
    {
      title: 'TRIR',
      subtitle: 'Total Recordable Incident Rate',
      value: '1.8',
      change: '-15%',
      changeType: 'positive',
      description: 'Nombre d\'incidents enregistrables par 200 000 heures travaillées'
    },
    {
      title: 'LTIFR',
      subtitle: 'Lost Time Injury Frequency Rate',
      value: '1.2',
      change: '-22%',
      changeType: 'positive',
      description: 'Fréquence des accidents avec arrêt de travail'
    },
    {
      title: 'Taux de Formation',
      subtitle: 'Pourcentage d\'employés formés',
      value: '94%',
      change: '+8%',
      changeType: 'positive',
      description: 'Pourcentage d\'employés ayant suivi une formation HSE'
    },
    {
      title: 'Conformité EPI',
      subtitle: 'Taux de conformité des EPI',
      value: '89%',
      change: '+3%',
      changeType: 'positive',
      description: 'Pourcentage d\'EPI en conformité et à jour'
    }
  ]

  const exportData = () => {
    const csvData = [
      ['Mois', 'Incidents', 'Formations', 'TRIR', 'LTIFR'],
      ...monthlyData.map(row => [row.month, row.incidents, row.formations, row.trir, row.ltifr])
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'statistiques-hse.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Statistiques HSE
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Analyse des performances et indicateurs de sécurité
          </p>
        </div>
        <motion.button
          onClick={exportData}
          className="flex items-center space-x-2 btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download size={20} />
          <span>Exporter</span>
        </motion.button>
      </motion.div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="sm:w-48">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Période
            </label>
            <select
              className="input-field"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="3months">3 derniers mois</option>
              <option value="6months">6 derniers mois</option>
              <option value="1year">1 an</option>
              <option value="2years">2 ans</option>
            </select>
          </div>
          <div className="sm:w-48">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Métrique principale
            </label>
            <select
              className="input-field"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              <option value="incidents">Incidents</option>
              <option value="formations">Formations</option>
              <option value="trir">TRIR</option>
              <option value="ltifr">LTIFR</option>
            </select>
          </div>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {kpi.value}
                  </h3>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {kpi.title}
                  </p>
                </div>
                <div className={`flex items-center space-x-1 ${
                  kpi.changeType === 'positive' ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {kpi.changeType === 'positive' ? (
                    <TrendingDown size={16} />
                  ) : (
                    <TrendingUp size={16} />
                  )}
                  <span className="text-sm font-medium">{kpi.change}</span>
                </div>
              </div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                {kpi.subtitle}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {kpi.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Trend Chart */}
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Évolution des Indicateurs
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Incident Types */}
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Répartition des Incidents
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incidentsByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {incidentsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Department Comparison */}
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Comparaison par Département
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={departmentStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="incidents" fill="#ef4444" name="Incidents" />
            <Bar dataKey="formations" fill="#22c55e" name="Formations" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed Stats Table */}
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Statistiques Détaillées par Département
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Département
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Incidents
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Formations
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Taux de Conformité
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {departmentStats.map((dept, index) => (
                <motion.tr
                  key={dept.department}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {dept.department}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200">
                      {dept.incidents}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200">
                      {dept.formations}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                    <div className="flex items-center">
                      <div className="flex-1 h-2 mr-2 bg-gray-200 rounded-full dark:bg-gray-700">
                        <div
                          className={`h-2 rounded-full ${
                            dept.conformity >= 95 ? 'bg-success-500' :
                            dept.conformity >= 90 ? 'bg-warning-500' : 'bg-danger-500'
                          }`}
                          style={{ width: `${dept.conformity}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{dept.conformity}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                    {dept.conformity >= 95 ? (
                      <span className="inline-flex items-center text-success-600">
                        <TrendingUp size={16} className="mr-1" />
                        Excellent
                      </span>
                    ) : dept.conformity >= 90 ? (
                      <span className="inline-flex items-center text-warning-600">
                        <TrendingUp size={16} className="mr-1" />
                        Bon
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-danger-600">
                        <TrendingDown size={16} className="mr-1" />
                        À améliorer
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Insights */}
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Analyses et Recommandations
        </h3>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800">
            <h4 className="mb-2 font-medium text-success-800 dark:text-success-200">
              Points Positifs
            </h4>
            <ul className="space-y-1 text-sm text-success-700 dark:text-success-300">
              <li>• Réduction de 15% du TRIR par rapport au trimestre précédent</li>
              <li>• Augmentation de 8% du taux de formation des employés</li>
              <li>• Le département Maintenance maintient un excellent taux de conformité</li>
            </ul>
          </div>
          
          <div className="p-4 border rounded-lg bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800">
            <h4 className="mb-2 font-medium text-warning-800 dark:text-warning-200">
              Points d'Attention
            </h4>
            <ul className="space-y-1 text-sm text-warning-700 dark:text-warning-300">
              <li>• Le département Logistique présente un taux de conformité inférieur à 90%</li>
              <li>• Augmentation des incidents environnementaux ce mois-ci</li>
              <li>• Besoin de renforcer les formations en sécurité incendie</li>
            </ul>
          </div>
          
          <div className="p-4 border rounded-lg bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
            <h4 className="mb-2 font-medium text-primary-800 dark:text-primary-200">
              Recommandations
            </h4>
            <ul className="space-y-1 text-sm text-primary-700 dark:text-primary-300">
              <li>• Organiser une session de formation spécifique pour le département Logistique</li>
              <li>• Mettre en place un audit environnemental approfondi</li>
              <li>• Planifier des exercices d'évacuation incendie trimestriels</li>
              <li>• Réviser les procédures de maintenance préventive</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Statistics
