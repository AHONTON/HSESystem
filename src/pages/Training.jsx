import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Calendar, Users, Clock, Award, BookOpen, Target, Eye, Edit, Trash2 } from 'lucide-react'
import Card from '../components/UI/Card'
import Modal from '../components/UI/Modal'
import { users } from '../data/users.json'
import Swal from 'sweetalert2'

const Training = () => {
  const [activeTab, setActiveTab] = useState('formations')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [modalMode, setModalMode] = useState('add')

  const [formations, setFormations] = useState([
    {
      id: 1,
      title: 'Formation Premiers Secours',
      description: 'Formation aux gestes de premiers secours et utilisation du défibrillateur',
      type: 'sécurité',
      duration: 480,
      maxParticipants: 12,
      instructor: 'Dr. Martin Dubois',
      date: '2024-02-15',
      status: 'planifiée',
      participants: [2, 3, 4],
      certification: true,
      location: 'Salle de formation A'
    },
    {
      id: 2,
      title: 'Sensibilisation Environnementale',
      description: 'Sensibilisation aux enjeux environnementaux et gestion des déchets',
      type: 'environnement',
      duration: 240,
      maxParticipants: 20,
      instructor: 'Sophie Leclerc',
      date: '2024-02-20',
      status: 'terminée',
      participants: [1, 2, 3, 4],
      certification: false,
      location: 'Amphithéâtre'
    },
    {
      id: 3,
      title: 'Utilisation des EPI',
      description: 'Formation sur le port et l\'entretien des équipements de protection individuelle',
      type: 'sécurité',
      duration: 180,
      maxParticipants: 15,
      instructor: 'Jean-Pierre Moreau',
      date: '2024-02-25',
      status: 'en_cours',
      participants: [3, 4],
      certification: true,
      location: 'Atelier de formation'
    }
  ])

  const [evaluations, setEvaluations] = useState([
    {
      id: 1,
      userId: 3,
      formationId: 1,
      score: 85,
      date: '2024-01-20',
      feedback: 'Très bonne participation, maîtrise des gestes de base',
      evaluator: 1
    },
    {
      id: 2,
      userId: 4,
      formationId: 2,
      score: 92,
      date: '2024-01-22',
      feedback: 'Excellente compréhension des enjeux environnementaux',
      evaluator: 1
    }
  ])

  const [recruitments, setRecruitments] = useState([
    {
      id: 1,
      position: 'Technicien HSE',
      department: 'Sécurité',
      status: 'ouvert',
      applications: 8,
      deadline: '2024-03-01',
      requirements: ['Bac+2 minimum', 'Expérience HSE', 'Permis B'],
      description: 'Recherche technicien HSE pour renforcer notre équipe sécurité'
    },
    {
      id: 2,
      position: 'Responsable Environnement',
      department: 'Environnement',
      status: 'en_cours',
      applications: 12,
      deadline: '2024-02-28',
      requirements: ['Bac+5', '5 ans d\'expérience', 'Certification ISO 14001'],
      description: 'Poste de responsable environnement pour piloter notre démarche RSE'
    }
  ])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'planifiée': return 'badge badge-warning'
      case 'en_cours': return 'badge badge-primary'
      case 'terminée': return 'badge badge-success'
      case 'annulée': return 'badge badge-danger'
      case 'ouvert': return 'badge badge-success'
      default: return 'badge'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'planifiée': return 'Planifiée'
      case 'en_cours': return 'En cours'
      case 'terminée': return 'Terminée'
      case 'annulée': return 'Annulée'
      case 'ouvert': return 'Ouvert'
      default: return status
    }
  }

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId)
    return user ? user.name : 'Utilisateur inconnu'
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'sécurité': return Award
      case 'environnement': return Target
      case 'formation': return BookOpen
      default: return BookOpen
    }
  }

  const filteredFormations = formations.filter(formation =>
    formation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formation.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddFormation = () => {
    setSelectedItem(null)
    setModalMode('add')
    setShowModal(true)
  }

  const handleViewItem = (item) => {
    setSelectedItem(item)
    setModalMode('view')
    setShowModal(true)
  }

  const FormationForm = ({ formation, mode, onClose }) => {
    const [formData, setFormData] = useState(formation || {
      title: '',
      description: '',
      type: 'sécurité',
      duration: 120,
      maxParticipants: 10,
      instructor: '',
      date: '',
      location: '',
      certification: false
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      if (mode === 'add') {
        const newFormation = {
          ...formData,
          id: Date.now(),
          status: 'planifiée',
          participants: []
        }
        setFormations(prev => [...prev, newFormation])
        Swal.fire('Ajoutée !', 'La formation a été ajoutée avec succès.', 'success')
      }
      onClose()
    }

    if (mode === 'view') {
      const Icon = getTypeIcon(formation.type)
      return (
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Icon className="w-8 h-8 text-primary-500" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {formation.title}
              </h3>
              <span className={getStatusBadge(formation.status)}>
                {getStatusLabel(formation.status)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Type
              </label>
              <p className="mt-1 text-sm text-gray-900 capitalize dark:text-white">
                {formation.type}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {new Date(formation.date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Durée
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {Math.floor(formation.duration / 60)}h {formation.duration % 60}min
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Lieu
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {formation.location}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Formateur
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {formation.instructor}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Participants
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {formation.participants.length} / {formation.maxParticipants}
              </p>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {formation.description}
              </p>
            </div>
          </div>

          {formation.certification && (
            <div className="p-4 border rounded-lg bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800">
              <div className="flex items-center space-x-2">
                <Award className="text-success-500" size={20} />
                <span className="text-sm font-medium text-success-700 dark:text-success-300">
                  Formation certifiante
                </span>
              </div>
            </div>
          )}

          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Participants inscrits
            </h4>
            <div className="space-y-2">
              {formation.participants.map(participantId => (
                <div key={participantId} className="flex items-center p-2 space-x-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <img
                    src={`/abstract-geometric-shapes.png?height=32&width=32&query=${getUserName(participantId)}`}
                    alt={getUserName(participantId)}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {getUserName(participantId)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Titre de la formation
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
            Description
          </label>
          <textarea
            required
            rows={3}
            className="mt-1 input-field"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Type
            </label>
            <select
              className="mt-1 input-field"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="sécurité">Sécurité</option>
              <option value="environnement">Environnement</option>
              <option value="formation">Formation générale</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Durée (minutes)
            </label>
            <input
              type="number"
              required
              min="30"
              className="mt-1 input-field"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date
            </label>
            <input
              type="date"
              required
              className="mt-1 input-field"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Participants max
            </label>
            <input
              type="number"
              required
              min="1"
              className="mt-1 input-field"
              value={formData.maxParticipants}
              onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Formateur
            </label>
            <input
              type="text"
              required
              className="mt-1 input-field"
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
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
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="certification"
            className="w-4 h-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
            checked={formData.certification}
            onChange={(e) => setFormData({ ...formData, certification: e.target.checked })}
          />
          <label htmlFor="certification" className="block ml-2 text-sm text-gray-900 dark:text-white">
            Formation certifiante
          </label>
        </div>

        <div className="flex justify-end pt-4 space-x-3">
          <button type="button" onClick={onClose} className="btn-secondary">
            Annuler
          </button>
          <button type="submit" className="btn-primary">
            Créer la formation
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
            Formations & Recrutement
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Gestion des formations HSE et processus de recrutement
          </p>
        </div>
        <motion.button
          onClick={handleAddFormation}
          className="flex items-center space-x-2 btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={20} />
          <span>Nouvelle formation</span>
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <Card>
        <div className="flex p-1 space-x-1 bg-gray-100 rounded-lg dark:bg-gray-800">
          {[
            { id: 'formations', label: 'Formations', count: formations.length },
            { id: 'evaluations', label: 'Évaluations', count: evaluations.length },
            { id: 'recrutement', label: 'Recrutement', count: recruitments.length }
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

      {/* Search */}
      <Card>
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
      </Card>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'formations' && (
          <motion.div
            key="formations"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          >
            {filteredFormations.map((formation, index) => {
              const Icon = getTypeIcon(formation.type)
              return (
                <motion.div
                  key={formation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="transition-shadow cursor-pointer hover:shadow-lg" onClick={() => handleViewItem(formation)}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                          <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formation.title}
                          </h3>
                          <span className={getStatusBadge(formation.status)}>
                            {getStatusLabel(formation.status)}
                          </span>
                        </div>
                      </div>
                      <Eye className="w-5 h-5 text-gray-400" />
                    </div>

                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {formation.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{new Date(formation.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{Math.floor(formation.duration / 60)}h {formation.duration % 60}min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users size={14} />
                        <span>{formation.participants.length}/{formation.maxParticipants}</span>
                      </div>
                      {formation.certification && (
                        <div className="flex items-center space-x-1">
                          <Award size={14} />
                          <span>Certifiante</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Formateur: {formation.instructor}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {activeTab === 'evaluations' && (
          <motion.div
            key="evaluations"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                        Participant
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                        Formation
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                        Score
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                        Date
                      </th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                        Commentaires
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                    {evaluations.map((evaluation, index) => {
                      const formation = formations.find(f => f.id === evaluation.formationId)
                      return (
                        <motion.tr
                          key={evaluation.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {getUserName(evaluation.userId)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                            {formation?.title || 'Formation inconnue'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              evaluation.score >= 80 ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200' :
                              evaluation.score >= 60 ? 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200' :
                              'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200'
                            }`}>
                              {evaluation.score}/100
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                            {new Date(evaluation.date).toLocaleDateString()}
                          </td>
                          <td className="max-w-xs px-6 py-4 text-sm text-gray-900 truncate dark:text-white">
                            {evaluation.feedback}
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'recrutement' && (
          <motion.div
            key="recrutement"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {recruitments.map((recruitment, index) => (
              <motion.div
                key={recruitment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {recruitment.position}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {recruitment.department}
                      </p>
                      <span className={getStatusBadge(recruitment.status)}>
                        {getStatusLabel(recruitment.status)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">
                        {recruitment.applications}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        candidatures
                      </p>
                    </div>
                  </div>

                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    {recruitment.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Exigences:
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {recruitment.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>Date limite: {new Date(recruitment.deadline).toLocaleDateString()}</span>
                    </div>
                    <button className="font-medium text-primary-600 hover:text-primary-700">
                      Voir les candidatures
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalMode === 'add' ? 'Nouvelle formation' :
          modalMode === 'view' ? 'Détails de la formation' :
          'Modifier la formation'
        }
        size="lg"
      >
        {selectedItem && modalMode === 'view' ? (
          <FormationForm formation={selectedItem} mode={modalMode} onClose={() => setShowModal(false)} />
        ) : (
          <FormationForm formation={selectedItem} mode={modalMode} onClose={() => setShowModal(false)} />
        )}
      </Modal>
    </div>
  )
}

export default Training
