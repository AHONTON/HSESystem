import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, Eye, EyeOff, Upload, X } from "lucide-react";
import axios from "axios";
import SwalHelper from "../utils/SwalHelper";
import { useAuth } from "../components/contexts/AuthContext";

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    sexe: "",
    password: "",
    confirmPassword: "",
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, setUser } = useAuth();

  if (user) return <Navigate to="/" />;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        SwalHelper.error("La taille max est 5MB");
        return;
      }
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        SwalHelper.error("Formats JPG, PNG, GIF uniquement");
        return;
      }
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      SwalHelper.error("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      SwalHelper.error("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => data.append(key, val));
      if (photo) data.append("photo", photo);

      // Appel API inscription
      const response = await axios.post("/api/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      SwalHelper.success("Inscription réussie !");

      // Si l'API renvoie un utilisateur, on met à jour le contexte
      if (response.data.user) setUser(response.data.user);
    } catch (error) {
      SwalHelper.error(
        error.response?.data?.message || "Erreur lors de l'inscription"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen min-h-screen px-4 overflow-hidden bg-gradient-to-br from-green-100 to-green-300 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        className="w-full max-w-4xl p-6 bg-white shadow-2xl sm:p-8 rounded-2xl dark:bg-gray-900"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ maxHeight: "calc(100vh - 3rem)", overflowY: "auto" }}
      >
        {/* En-tête */}
        <div className="mb-6 text-center">
          <motion.div
            className="flex items-center justify-center w-16 h-16 mx-auto bg-green-700 rounded-full shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <UserPlus className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            Créer un compte HSE
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Rejoignez notre plateforme
          </p>
        </div>

        {/* Formulaire */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Photo profil */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              {photoPreview ? (
                <>
                  <img
                    src={photoPreview}
                    alt="Aperçu photo"
                    className="object-cover w-20 h-20 border-4 border-gray-300 rounded-full dark:border-gray-600"
                  />
                  <button
                    type="button"
                    aria-label="Supprimer la photo"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 btn btn-sm btn-circle btn-error"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-center w-20 h-20 border-4 border-gray-300 border-dashed rounded-full dark:border-gray-600">
                  <Upload className="text-gray-400 w-7 h-7" />
                </div>
              )}
            </div>
            <label
              htmlFor="photo-upload"
              className="flex items-center gap-2 cursor-pointer select-none btn btn-outline btn-sm"
            >
              <Upload size={16} />
              Choisir une photo
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          {/* Champs en grille 2 colonnes */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <div>
              <label
                htmlFor="nom"
                className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nom
              </label>
              <input
                id="nom"
                name="nom"
                type="text"
                required
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Votre nom"
                value={formData.nom}
                onChange={handleInputChange}
                autoComplete="family-name"
                spellCheck={false}
              />
            </div>

            <div>
              <label
                htmlFor="prenom"
                className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Prénom
              </label>
              <input
                id="prenom"
                name="prenom"
                type="text"
                required
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Votre prénom"
                value={formData.prenom}
                onChange={handleInputChange}
                autoComplete="given-name"
                spellCheck={false}
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="email"
                className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="votre.email@exemple.com"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                spellCheck={false}
              />
            </div>

            <div>
              <label
                htmlFor="telephone"
                className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Téléphone
              </label>
              <input
                id="telephone"
                name="telephone"
                type="tel"
                required
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="+229 XX XX XX XX"
                value={formData.telephone}
                onChange={handleInputChange}
                autoComplete="tel"
                spellCheck={false}
              />
            </div>

            <div>
              <label
                htmlFor="sexe"
                className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Sexe
              </label>
              <select
                id="sexe"
                name="sexe"
                required
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={formData.sexe}
                onChange={handleInputChange}
                autoComplete="sex"
              >
                <option value="">Choisir...</option>
                <option value="masculin">Masculin</option>
                <option value="feminin">Féminin</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-3 py-2 pr-10 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="Min. 6 caractères"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="new-password"
                  spellCheck={false}
                />
                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Cacher mot de passe"
                      : "Afficher mot de passe"
                  }
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirmer votre mot de passe
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="w-full px-3 py-2 pr-10 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="Confirmer le mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  autoComplete="new-password"
                  spellCheck={false}
                />
                <button
                  type="button"
                  aria-label={
                    showConfirmPassword
                      ? "Cacher mot de passe"
                      : "Afficher mot de passe"
                  }
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Bouton S'inscrire centré et dimensionné */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="block w-48 px-6 py-2 mx-auto font-medium text-white transition-all duration-300 ease-in-out bg-green-700 rounded-lg hover:bg-green-800 disabled:opacity-60"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "S'inscrire"
            )}
          </motion.button>

          <div className="pt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Vous avez déjà un compte ?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-semibold text-green-600 hover:underline"
              >
                Se connecter
              </button>
            </p>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Register;
