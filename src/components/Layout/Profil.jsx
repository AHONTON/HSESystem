import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import SwalHelper from "../../utils/SwalHelper";

const Profil = ({ isOpen, onClose, userId, onUpdate }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      axios
        .get(`/api/users/${userId}`)
        .then((res) => {
          const { firstName, lastName, email, phone, avatar } = res.data;
          setForm({ firstName, lastName, email, phone, avatar });
        })
        .catch(() => {
          SwalHelper.error(
            "Erreur",
            "Impossible de récupérer les données utilisateur."
          );
        });
    }
  }, [isOpen, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    SwalHelper.loading("Mise à jour...", "Veuillez patienter");

    try {
      await axios.put(`/api/users/${userId}`, form);
      onUpdate(form);
      SwalHelper.success(
        "Profil mis à jour",
        "Les informations ont bien été enregistrées."
      );
      onClose();
    } catch (error) {
      SwalHelper.error("Erreur", "La mise à jour du profil a échoué.");
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
              Modifier Profil
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Prénom
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nom
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  URL Photo
                </label>
                <input
                  type="text"
                  name="avatar"
                  value={form.avatar}
                  onChange={handleChange}
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
                  {loading ? "Chargement..." : "Mettre à jour"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Profil;
