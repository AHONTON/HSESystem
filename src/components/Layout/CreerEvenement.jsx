import React, { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

const CreerEvenement = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('/api/events', form)
      onAdd(res.data)
      onClose()
    } catch (error) {
      alert("Erreur lors de la création de l'événement")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-md p-6 bg-white rounded-lg dark:bg-gray-800"
        initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Créer un événement</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Titre</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} required className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Heure</label>
            <input type="time" name="time" value={form.time} onChange={handleChange} required className="w-full p-2 border rounded" />
          </div>
          <div className="flex justify-end mt-6 space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-300 rounded hover:bg-gray-400">Annuler</button>
            <button type="submit" disabled={loading} className="px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Chargement...' : 'Créer'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default CreerEvenement
