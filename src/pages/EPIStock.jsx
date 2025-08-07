import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Package, AlertTriangle, Edit, TrendingDown, TrendingUp } from 'lucide-react'
import Card from '../components/UI/Card'
import Modal from '../components/UI/Modal'
import { epiStock as initialStock } from '../data/epi.json'
import Swal from 'sweetalert2'

const EPIStock = () => {
  const [stock, setStock] = useState(initialStock)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [modalMode, setModalMode] = useState('add')

  const filteredStock = stock.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const lowStockItems = stock.filter(item => item.quantity <= item.minStock)

  const handleAddItem = () => {
    setSelectedItem(null)
    setModalMode('add')
    setShowModal(true)
  }

  const handleEditItem = (item) => {
    setSelectedItem(item)
    setModalMode('edit')
    setShowModal(true)
  }

  const getStockStatus = (quantity, minStock) => {
    if (quantity === 0) return { status: 'rupture', color: 'text-danger-500', bg: 'bg-danger-100 dark:bg-danger-900/20' }
    if (quantity <= minStock) return { status: 'critique', color: 'text-warning-500', bg: 'bg-warning-100 dark:bg-warning-900/20' }
    return { status: 'normal', color: 'text-success-500', bg: 'bg-success-100 dark:bg-success-900/20' }
  }

  const StockForm = ({ item, mode, onClose }) => {
    const [formData, setFormData] = useState(item || {
      name: '',
      category: '',
      quantity: 0,
      minStock: 0,
      price: 0,
      supplier: ''
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      if (mode === 'add') {
        const newItem = {
          ...formData,
          id: Date.now(),
          lastUpdate: new Date().toISOString().split('T')[0]
        }
        setStock(prev => [...prev, newItem])
        Swal.fire('Ajouté !', 'L\'article a été ajouté au stock.', 'success')
      } else if (mode === 'edit') {
        setStock(prev => prev.map(i => i.id === item.id ? { ...i, ...formData, lastUpdate: new Date().toISOString().split('T')[0] } : i))
        Swal.fire('Modifié !', 'L\'article a été modifié.', 'success')
      }
      onClose()
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nom de l'EPI
            </label>
            <input
              type="text"
              required
              className="mt-1 input-field"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Catégorie
            </label>
            <input
              type="text"
              required
              className="mt-1 input-field"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quantité
            </label>
            <input
              type="number"
              required
              min="0"
              className="mt-1 input-field"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Stock minimum
            </label>
            <input
              type="number"
              required
              min="0"
              className="mt-1 input-field"
              value={formData.minStock}
              onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Prix unitaire (€)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="mt-1 input-field"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fournisseur
            </label>
            <input
              type="text"
              className="mt-1 input-field"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            />
          </div>
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
            {mode === 'add' ? 'Ajouter' : 'Modifier'}
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
            Stock des EPI
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Gestion de l'inventaire des équipements de protection
          </p>
        </div>
        <motion.button
          onClick={handleAddItem}
          className="flex items-center space-x-2 btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={20} />
          <span>Nouvel article</span>
        </motion.button>
      </motion.div>

      {/* Alerts */}
      {lowStockItems.length > 0 && (
        <motion.div
          className="p-4 border rounded-lg bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-2">
            <AlertTriangle className="text-warning-500" size={20} />
            <h3 className="text-sm font-medium text-warning-700 dark:text-warning-300">
              Alerte Stock Critique
            </h3>
          </div>
          <p className="mt-1 text-sm text-warning-600 dark:text-warning-400">
            {lowStockItems.length} article{lowStockItems.length > 1 ? 's' : ''} en stock critique ou en rupture
          </p>
        </motion.div>
      )}

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
          <input
            type="text"
            placeholder="Rechercher un article..."
            className="pl-10 input-field"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Stock Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredStock.map((item, index) => {
            const stockStatus = getStockStatus(item.quantity, item.minStock)
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="relative">
                  {stockStatus.status !== 'normal' && (
                    <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
                      stockStatus.status === 'rupture' ? 'bg-danger-500' : 'bg-warning-500'
                    }`} />
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${stockStatus.bg}`}>
                        <Package className={`h-6 w-6 ${stockStatus.color}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.category}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => handleEditItem(item)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit size={16} />
                    </motion.button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Quantité</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg font-semibold ${stockStatus.color}`}>
                          {item.quantity}
                        </span>
                        {item.quantity <= item.minStock ? (
                          <TrendingDown className="text-danger-500" size={16} />
                        ) : (
                          <TrendingUp className="text-success-500" size={16} />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Stock min.</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.minStock}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Prix unitaire</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.price.toFixed(2)} €
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Fournisseur</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.supplier}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Dernière MAJ
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(item.lastUpdate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {stockStatus.status !== 'normal' && (
                      <div className={`p-2 rounded-lg ${stockStatus.bg} border ${
                        stockStatus.status === 'rupture' ? 'border-danger-200 dark:border-danger-800' : 'border-warning-200 dark:border-warning-800'
                      }`}>
                        <p className={`text-xs font-medium ${stockStatus.color}`}>
                          {stockStatus.status === 'rupture' ? 'Stock épuisé' : 'Stock critique'}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {filteredStock.length === 0 && (
        <Card>
          <div className="py-12 text-center">
            <Package className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Aucun article trouvé
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Aucun article ne correspond à votre recherche.
            </p>
          </div>
        </Card>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'add' ? 'Nouvel article' : 'Modifier l\'article'}
        size="lg"
      >
        <StockForm
          item={selectedItem}
          mode={modalMode}
          onClose={() => setShowModal(false)}
        />
      </Modal>
    </div>
  )
}

export default EPIStock
