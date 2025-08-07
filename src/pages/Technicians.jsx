import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Shield, Calendar, AlertTriangle, CheckCircle } from 'lucide-react'
import Card from '../components/UI/Card'
import Modal from '../components/UI/Modal'
import { users } from '../data/users.json'
import { epiStock, epiAssignments } from '../data/epi.json'
import Swal from 'sweetalert2'

const Technicians = () => {
  const [assignments, setAssignments] = useState(epiAssignments)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedTechnician, setSelectedTechnician] = useState(null)

  const technicians = users.filter(user => user.role === 'technicien')

  const getTechnicianEPI = (technicianId) => {
    return assignments
      .filter(assignment => assignment.userId === technicianId)
      .map(assignment => {
        const epi = epiStock.find(e => e.id === assignment.epiId)
        return {
          ...assignment,
          epiName: epi?.name || 'EPI inconnu',
          epiCategory: epi?.category || 'Catégorie inconnue'
        }
      })
  }

  const getStatusBadge = (status, expiryDate) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))

    if (status === 'expiré' || daysUntilExpiry < 0) {
      return 'badge badge-danger'
    } else if (daysUntilExpiry <= 30) {
      return 'badge badge-warning'
    } else {
      return 'badge badge-success'
    }
  }

  const getStatusLabel = (status, expiryDate) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))

    if (status === 'expiré' || daysUntilExpiry < 0) {
      return 'Expiré'
    } else if (daysUntilExpiry <= 30) {
      return `Expire dans ${daysUntilExpiry}j`
    } else {
      return 'Valide'
    }
  }

  const handleAssignEPI = (technician) => {
    setSelectedTechnician(technician)
    setShowModal(true)
  }

  const EPIAssignmentForm = ({ technician, onClose }) => {
    const [formData, setFormData] = useState({
      epiId: '',
      expiryDate: ''
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      const newAssignment = {
        id: Date.now(),
        userId: technician.id,
        epiId: parseInt(formData.epiId),
        assignDate: new Date().toISOString().split('T')[0],
        expiryDate: formData.expiryDate,
        status: 'valide'
      }
      
      setAssignments(prev => [...prev, newAssignment])
      Swal.fire('Assigné !', 'L\'EPI a été assigné avec succès.', 'success')
      onClose()
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Équipement de Protection
          </label>
          <select
            required
            className="mt-1 input-field"
            value={formData.epiId}
            onChange={(e) => setFormData({ ...formData, epiId: e.target.value })}
          >
            <option value="">Sélectionner un EPI</option>
            {epiStock.map(epi => (
              <option key={epi.id} value={epi.id}>
                {epi.name} - {epi.category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date d'expiration
          </label>
          <input
            type="date"
            required
            className="mt-1 input-field"
            value={formData.expiryDate}
            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          />
        </div>

        <div className="flex justify-end pt-4 space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Assigner
          </button>
        </div>
      </form>
    )
  }

  const filteredTechnicians = technicians.filter(tech =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
            Techniciens & EPI
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Gestion des équipements de protection individuelle
          </p>
        </div>
      </motion.div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
          <input
            type="text"
            placeholder="Rechercher un technicien..."
            className="pl-10 input-field"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AnimatePresence>
          {filteredTechnicians.map((technician, index) => {
            const technicianEPI = getTechnicianEPI(technician.id)
            const expiredCount = technicianEPI.filter(epi => {
              const today = new Date()
              const expiry = new Date(epi.expiryDate)
              return expiry < today || epi.status === 'expiré'
            }).length

            return (
              <motion.div
                key={technician.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={technician.avatar || "/placeholder.svg"}
                        alt={technician.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {technician.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {technician.position}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => handleAssignEPI(technician)}
                      className="flex items-center space-x-2 btn-primary"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus size={16} />
                      <span>Assigner EPI</span>
                    </motion.button>
                  </div>

                  {expiredCount > 0 && (
                    <motion.div
                      className="p-3 mb-4 border rounded-lg bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="text-danger-500" size={16} />
                        <span className="text-sm font-medium text-danger-700 dark:text-danger-300">
                          {expiredCount} EPI expiré{expiredCount > 1 ? 's' : ''}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      EPI Assignés ({technicianEPI.length})
                    </h4>
                    
                    {technicianEPI.length === 0 ? (
                      <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                        <Shield className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Aucun EPI assigné</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {technicianEPI.map((epi) => (
                          <motion.div
                            key={epi.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex items-center space-x-3">
                              <Shield className="text-primary-500" size={16} />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {epi.epiName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {epi.epiCategory}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={getStatusBadge(epi.status, epi.expiryDate)}>
                                {getStatusLabel(epi.status, epi.expiryDate)}
                              </span>
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Exp: {new Date(epi.expiryDate).toLocaleDateString()}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {filteredTechnicians.length === 0 && (
        <Card>
          <div className="py-12 text-center">
            <Shield className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Aucun technicien trouvé
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Aucun technicien ne correspond à votre recherche.
            </p>
          </div>
        </Card>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Assigner EPI - ${selectedTechnician?.name}`}
      >
        {selectedTechnician && (
          <EPIAssignmentForm
            technician={selectedTechnician}
            onClose={() => setShowModal(false)}
          />
        )}
      </Modal>
    </div>
  )
}

export default Technicians
