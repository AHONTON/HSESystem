import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import SwalHelper from "../../utils/SwalHelper";

const CreerEvenement = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    SwalHelper.loading("Création en cours...", "Veuillez patienter");

    try {
      const res = await axios.post("/api/events", form);
      onAdd(res.data);

      // Fermer l'alerte loading
      SwalHelper.loading().close();

      // Afficher le résumé dans une alerte custom
      SwalHelper.custom({
        title: "Événement créé avec succès",
        html: `
          <p><strong>Titre :</strong> ${res.data.title}</p>
          <p><strong>Description :</strong> ${
            res.data.description || "<i>Aucune</i>"
          }</p>
          <p><strong>Date :</strong> ${res.data.date}</p>
          <p><strong>Heure :</strong> ${res.data.time}</p>
        `,
        confirmButtonText: "OK",
        icon: "success",
        showCancelButton: false,
        customClass: {
          popup: "text-left text-base rounded-xl px-6 py-4",
          title: "text-xl font-semibold mb-2",
          htmlContainer: "text-sm",
        },
      });

      onClose();
    } catch (error) {
      SwalHelper.error("Erreur", "La création de l'événement a échoué.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Créer un événement
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Titre
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Heure
                </label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Chargement..." : "Créer"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreerEvenement;
