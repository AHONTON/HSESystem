import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff } from "lucide-react";
import SwalHelper from "../utils/SwalHelper";
import { useAuth } from "../components/contexts/AuthContext";

const Login = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();

  // Redirige vers la page d'accueil si l'utilisateur est déjà connecté
  if (user) return <Navigate to="/" />;

  // Soumission du formulaire de connexion
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });
      SwalHelper.success(
        "Connexion réussie",
        "Bienvenue dans l'application HSE"
      );
    } catch (error) {
      SwalHelper.error(
        "Erreur de connexion",
        error.response?.data?.message || "Email ou mot de passe incorrect"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen px-4 bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        className="w-full max-w-lg p-10 bg-white shadow-2xl dark:bg-gray-900 rounded-2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* En-tête avec icône et titre */}
        <div className="text-center">
          <motion.div
            className="flex items-center justify-center w-16 h-16 mx-auto bg-green-700 rounded-full shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-bold text-gray-800 dark:text-white">
            HSE Administrator
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Veuillez vous connecter à votre compte
          </p>
        </div>

        {/* Formulaire de connexion */}
        <motion.form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="space-y-4">
            {/* Champ email */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre adresse email"
                className="w-full px-4 py-2 text-sm bg-white border rounded-lg outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Champ mot de passe avec toggle visibilité */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="mot de passe"
                  className="w-full px-4 py-2 pr-10 text-sm bg-white border rounded-lg outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 flex items-center text-green-600 right-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Bouton de connexion */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="block w-3/4 px-6 py-2 mx-auto font-medium text-white transition-all duration-300 ease-in-out bg-green-700 rounded-lg hover:bg-green-800"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Se connecter"
            )}
          </motion.button>

          {/* Lien vers l'inscription */}
          <div className="pt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Vous n'avez pas de compte ?{" "}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="font-semibold text-green-600 hover:underline"
              >
                S'inscrire
              </button>
            </p>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Login;
