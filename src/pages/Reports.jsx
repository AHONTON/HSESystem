import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Calendar, Filter, Eye, Printer, Share2 } from 'lucide-react'
import Card from '../components/UI/Card'
import { incidents, activities } from '../data/incidents.json'
import { users } from '../data/users.json'
import { epiAssignments } from '../data/epi.json'
import Swal from 'sweetalert2'

const Reports = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [reportType, setReportType] = useState('daily')
  const [generatedReport, setGeneratedReport] = useState(null)

  const generateReport = () => {
    const reportDate = new Date(selectedDate)
    const dateStr = reportDate.toLocaleDateString()

    // Simuler la génération du rapport
    const report = {
      id: Date.now(),
      type: reportType,
      date: selectedDate,
      generatedAt: new Date().toISOString(),
      data: {
        incidents: incidents.filter(i => i.date === selectedDate),
        activities: activities.filter(a => a.date === selectedDate),
        expiredEPI: epiAssignments.filter(epi => {
          const expiryDate = new Date(epi.expiryDate)
          return expiryDate <= reportDate
        }),
        stats: {
          totalIncidents: incidents.length,
          resolvedIncidents: incidents.filter(i => i.status === 'résolu').length,
          totalActivities: activities.length,
          totalUsers: users.length
        }
      }
    }

    setGeneratedReport(report)
    Swal.fire({
      icon: 'success',
      title: 'Rapport généré',
      text: `Le rapport ${reportType === 'daily' ? 'journalier' : 'mensuel'} du ${dateStr} a été généré avec succès.`,
      timer: 2000,
      showConfirmButton: false
    })
  }

  const exportToPDF = () => {
    Swal.fire({
      icon: 'info',
      title: 'Export PDF',
      text: 'Fonctionnalité d\'export PDF en cours de développement.',
      timer: 2000,
      showConfirmButton: false
    })
  }

  const exportToCSV = () => {
    if (!generatedReport) return

    const csvData = [
      ['Type', 'Date', 'Incidents', 'Activités', 'EPI Expirés'],
      [
        generatedReport.type === 'daily' ? 'Journalier' : 'Mensuel',
        new Date(generatedReport.date).toLocaleDateString(),
        generatedReport.data.incidents.length,
        generatedReport.data.activities.length,
        generatedReport.data.expiredEPI.length
      ]
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rapport-hse-${generatedReport.date}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    Swal.fire({
      icon: 'success',
      title: 'Export CSV',
      text: 'Le rapport a été exporté en CSV avec succès.',
      timer: 2000,
      showConfirmButton: false
    })
  }

  const ReportPreview = ({ report }) => {
    if (!report) return null

    return (
      <Card>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Rapport {report.type === 'daily' ? 'Journalier' : 'Mensuel'} HSE
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Période: {new Date(report.date).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Généré le {new Date(report.generatedAt).toLocaleString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <motion.button
                onClick={exportToPDF}
                className="flex items-center space-x-2 btn-secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Printer size={16} />
                <span>PDF</span>
              </motion.button>
              <motion.button
                onClick={exportToCSV}
                className="flex items-center space-x-2 btn-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download size={16} />
                <span>CSV</span>
              </motion.button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: 'Incidents du jour', value: report.data.incidents.length, color: 'text-danger-600' },
              { label: 'Activités réalisées', value: report.data.activities.length, color: 'text-success-600' },
              { label: 'EPI expirés', value: report.data.expiredEPI.length, color: 'text-warning-600' },
              { label: 'Taux de résolution', value: `${Math.round((report.data.stats.resolvedIncidents / Math.max(report.data.stats.totalIncidents, 1)) * 100)}%`, color: 'text-primary-600' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="p-4 text-center rounded-lg bg-gray-50 dark:bg-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Incidents Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Incidents ({report.data.incidents.length})
            </h3>
            {report.data.incidents.length === 0 ? (
              <p className="py-4 text-center text-gray-500 dark:text-gray-400">
                Aucun incident déclaré pour cette période.
              </p>
            ) : (
              <div className="space-y-3">
                {report.data.incidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {incident.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {incident.location} - {incident.type}
                        </p>
                      </div>
                      <span className={`badge ${
                        incident.severity === 'élevé' ? 'badge-danger' :
                        incident.severity === 'moyen' ? 'badge-warning' : 'badge-success'
                      }`}>
                        {incident.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activities Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Activités HSE ({report.data.activities.length})
            </h3>
            {report.data.activities.length === 0 ? (
              <p className="py-4 text-center text-gray-500 dark:text-gray-400">
                Aucune activité réalisée pour cette période.
              </p>
            ) : (
              <div className="space-y-3">
                {report.data.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {activity.type} - {activity.duration} min
                        </p>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.participants?.length || 0} participants
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* EPI Expired Section */}
          {report.data.expiredEPI.length > 0 && (
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                EPI Expirés ({report.data.expiredEPI.length})
              </h3>
              <div className="space-y-3">
                {report.data.expiredEPI.map((epi) => (
                  <div
                    key={epi.id}
                    className="p-4 border rounded-lg bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          EPI ID: {epi.epiId}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Utilisateur ID: {epi.userId}
                        </p>
                      </div>
                      <span className="text-sm text-warning-600 dark:text-warning-400">
                        Expiré le {new Date(epi.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Recommandations
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {report.data.incidents.length > 0 && (
                <p>• Suivre la résolution des incidents en cours</p>
              )}
              {report.data.expiredEPI.length > 0 && (
                <p>• Renouveler les EPI expirés dans les plus brefs délais</p>
              )}
              {report.data.activities.length === 0 && (
                <p>• Planifier des activités de sensibilisation HSE</p>
              )}
              <p>• Maintenir la surveillance des indicateurs de sécurité</p>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Rapports HSE
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Génération et consultation des rapports de sécurité
        </p>
      </motion.div>

      {/* Report Generation */}
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Générer un rapport
        </h2>
        
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Type de rapport
            </label>
            <select
              className="input-field"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="daily">Rapport journalier</option>
              <option value="monthly">Rapport mensuel</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Date
            </label>
            <input
              type="date"
              className="input-field"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          
          <div className="flex items-end">
            <motion.button
              onClick={generateReport}
              className="flex items-center justify-center w-full space-x-2 btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FileText size={20} />
              <span>Générer</span>
            </motion.button>
          </div>
        </div>
      </Card>

      {/* Report Preview */}
      {generatedReport && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ReportPreview report={generatedReport} />
        </motion.div>
      )}

      {/* Recent Reports */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Rapports récents
          </h2>
          <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
            Voir tous
          </button>
        </div>

        <div className="space-y-3">
          {[
            { id: 1, type: 'daily', date: '2024-01-15', status: 'generated' },
            { id: 2, type: 'daily', date: '2024-01-14', status: 'generated' },
            { id: 3, type: 'monthly', date: '2024-01-01', status: 'generated' },
            { id: 4, type: 'daily', date: '2024-01-13', status: 'generated' }
          ].map((report, index) => (
            <motion.div
              key={report.id}
              className="flex items-center justify-between p-4 transition-colors rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                  <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Rapport {report.type === 'daily' ? 'journalier' : 'mensuel'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(report.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="badge badge-success">Généré</span>
                <div className="flex space-x-1">
                  <motion.button
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Eye size={16} />
                  </motion.button>
                  <motion.button
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Download size={16} />
                  </motion.button>
                  <motion.button
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share2 size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Reports
