import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Filter, AlertTriangle, FlameIcon as Fire, Leaf, Calendar, User, MapPin, Eye, Edit } from 'lucide-react'
import Card from '../components/UI/Card'
import Modal from '../components/UI/Modal'
import { incidents, activities } from '../data/incidents.json'
import { users } from '../data/users.json'
import Swal from 'sweetalert2'

const Incidents = () => {
  const [incidentList, setIncidentList] = useState(incidents)
  const [activityList, setActivityList] = useState(activities)
  const [activeTab, setActiveTab] = useState('incidents')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [modalMode, setModalMode] = useState('add')

  const getTypeIcon = (type) => {
    switch (type) {
      case 'incendie': return Fire
      case 'environnement': return Leaf
      case 'accident': return AlertTriangle
      default: return AlertTriangle
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'incendie': return 'text-danger-500'
      case 'environnement': return 'text-success-500'
      case 'accident': return 'text-warning-500'
      default: return 'text-gray-500'
    }
  }

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'élevé': return 'badge badge-danger'
      case 'moyen': return 'badge badge-warning'
      case 'faible': return 'badge badge-success'
      default: return 'badge'
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'résolu': return 'badge badge-success'
      case 'en_cours': return 'badge badge-warning'
      case 'nouveau': return 'badge badge-danger'
      default: return 'badge'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'résolu': return 'Résolu'
      case 'en_cours': return 'En cours'
      case 'nouveau': return 'Nouveau'
      default: return status
    }
  }

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId)
    return user ? user.name : 'Utilisateur inconnu'
  }

  const filteredIncidents = incidentList.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || incident.type === filterType
    const matchesStatus = filterStatus === 'all' || incident.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const filteredActivities = activityList.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || activity.type === filterType
    return matchesSearch && matchesType
  })

  const handleAddIncident = () => {
    setSelectedItem(null)
    setModalMode('add')
    setShowModal(true)
  }

  const handleViewItem = (item) => {
    setSelectedItem(item)
    setModalMode('view')
    setShowModal(true)
  }

  const IncidentForm = ({ incident, mode, onClose }) => {
    const [formData, setFormData] = useState(incident || {
      type: 'accident',
      title: '',
      description: '',
      location: '',
      severity: 'moyen',
      status: 'nouveau',
      actions: ''
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      if (mode === 'add') {
        const newIncident = {
          ...formData,
          id: Date.now(),
          reportedBy: 1, // Current user
          date: new Date().toISOString().split('T')[0]
        }
        setIncidentList(prev => [...prev, newIncident])
        Swal.fire('Déclaré !', 'L\'incident a été déclaré avec succès.', 'success')
      }
      onClose()
    }

    if (mode === 'view') {
      const Icon = getTypeIcon(incident.type)
      return (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Icon className={`h-8 w-8 ${getTypeColor(incident.type)}`} />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {incident.title}
              </h3>
              <div className="flex items-center mt-1 space-x-2">
                <span className={getSeverityBadge(incident.severity)}>
                  {incident.severity}
                </span>
                <span className={getStatusBadge(incident.status)}>
                  {getStatusLabel(incident.status)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {new Date(incident.date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Déclaré par
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {getUserName(incident.reportedBy)}
              </p>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Lieu
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {incident.location}
              </p>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {incident.description}
              </p>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Actions prises
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {incident.actions}
              </p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Type d'incident
            </label>
            <select
              className="mt-1 input-field"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="accident">Accident</option>
              <option value="incendie">Incendie</option>
              <option value="environnement">Environnement</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Gravité
            </label>
            <select
              className="mt-1 input-field"
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
            >
              <option value="faible">Faible</option>
              <option value="moyen">Moyen</option>
              <option value="élevé">Élevé</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Titre
          </label>
          <input
            type="text"
            required
            className="mt-1 input-field"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Lieu
          </label>
          <input
            type="text"
            required
            className="mt-1 input-field"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            required
            rows={4}
            className="mt-1 input-field"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Actions prises
          </label>
          <textarea
            rows={3}
            className="mt-1 input-field"
            value={formData.actions}
            onChange={(e) => setFormData({ ...formData, actions: e.target.value })}
          />
        </div>

        <div className="flex justify-end pt-4 space-x-3">
          <button type="button" onClick={onClose} className="btn-secondary">
            Annuler
          </button>
          <button type="submit" className="btn-primary">
            Déclarer l'incident
          </button>
        </div>
      </form>
    )
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
            Incidents & Activités HSE
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Gestion des incidents et suivi des activités de sécurité
          </p>
        </div>
        <motion.button
          onClick={handleAddIncident}
          className="flex items-center space-x-2 btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={20} />
          <span>Déclarer incident</span>
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <Card>
        <div className="flex p-1 space-x-1 bg-gray-100 rounded-lg dark:bg-gray-800">
          {[
            { id: 'incidents', label: 'Incidents', count: incidentList.length },
            { id: 'activities', label: 'Activités', count: activityList.length }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab.label} ({tab.count})
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 input-field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="input-field"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Tous les types</option>
              <option value="accident">Accidents</option>
              <option value="incendie">Incendies</option>
              <option value="environnement">Environnement</option>
              {activeTab === 'activities' && (
                <>
                  <option value="formation">Formations</option>
                  <option value="inspection">Inspections</option>
                  <option value="sensibilisation">Sensibilisation</option>
                </>
              )}
            </select>
          </div>
          {activeTab === 'incidents' && (
            <div className="sm:w-48">
              <select
                className="input-field"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="nouveau">Nouveau</option>
                <option value="en_cours">En cours</option>
                <option value="résolu">Résolu</option>
              </select>
            </div>
          )}
        </div>
      </Card>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'incidents' ? (
          <motion.div
            key="incidents"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          >
            {filteredIncidents.map((incident, index) => {
              const Icon = getTypeIcon(incident.type)
              return (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="transition-shadow cursor-pointer hover:shadow-lg" onClick={() => handleViewItem(incident)}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800`}>
                          <Icon className={`h-5 w-5 ${getTypeColor(incident.type)}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {incident.title}
                          </h3>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className={getSeverityBadge(incident.severity)}>
                              {incident.severity}
                            </span>
                            <span className={getStatusBadge(incident.status)}>
                              {getStatusLabel(incident.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Eye className="w-5 h-5 text-gray-400" />
                    </div>

                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {incident.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{new Date(incident.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin size={14} />
                          <span>{incident.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User size={14} />
                        <span>{getUserName(incident.reportedBy)}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            key="activities"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          >
            {filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {activity.title}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 mt-1">
                        {activity.type}
                      </span>
                    </div>
                  </div>

                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    {activity.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center justify-between">
                      <span>Date:</span>
                      <span>{new Date(activity.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Durée:</span>
                      <span>{activity.duration} min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Participants:</span>
                      <span>{activity.participants?.length || 0}</span>
                    </div>
                    {activity.instructor && (
                      <div className="flex items-center justify-between">
                        <span>Formateur:</span>
                        <span>{getUserName(activity.instructor)}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {((activeTab === 'incidents' && filteredIncidents.length === 0) ||
        (activeTab === 'activities' && filteredActivities.length === 0)) && (
        <Card>
          <div className="py-12 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Aucun {activeTab === 'incidents' ? 'incident' : 'activité'} trouvé
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Aucun élément ne correspond à vos critères de recherche.
            </p>
          </div>
        </Card>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalMode === 'add' ? 'Déclarer un incident' :
          modalMode === 'view' ? 'Détails de l\'incident' :
          'Modifier l\'incident'
        }
        size="lg"
      >
        {selectedItem && modalMode === 'view' ? (
          <IncidentForm incident={selectedItem} mode={modalMode} onClose={() => setShowModal(false)} />
        ) : (
          <IncidentForm incident={selectedItem} mode={modalMode} onClose={() => setShowModal(false)} />
        )}
      </Modal>
    </div>
  )
}

export default Incidents
