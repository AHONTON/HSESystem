import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Bell,
  Moon,
  Sun,
  User,
  LogOut,
  Settings,
  CalendarPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useLang } from "../contexts/LangContext";
import axios from "axios";
import SwalHelper from "../../utils/SwalHelper";
import Parametre from "./Parametre";
import CreerEvenement from "./CreerEvenement";
import Profil from "./Profil";
import UserSearchContainer from "./UserSearchContainer";

// Définition du composant Header
const Header = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLang();
  const [searchTerm, setSearchTerm] = useState("");

  // État pour les données de l'utilisateur, l'état de connexion et l'authentification
  const [user, setUser] = useState({
    id: null,
    name: "",
    email: "",
    avatar: "",
    status: "disconnected",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showParametre, setShowParametre] = useState(false);
  const [showCreerEvent, setShowCreerEvent] = useState(false);

  // Données statiques des notifications (inchangées)
  const unreadCount = 3;
  const notifications = [
    {
      id: 1,
      title: "Nouvelle alerte sécurité",
      message: "Incident signalé en zone A",
      time: "Il y a 5 min",
    },
    {
      id: 2,
      title: "Rapport mensuel",
      message: "Le rapport HSE est disponible",
      time: "Il y a 1h",
    },
    {
      id: 3,
      title: "Formation obligatoire",
      message: "Nouvelle formation disponible",
      time: "Il y a 2h",
    },
  ];

  // Récupération des données utilisateur et vérification de l'authentification
  useEffect(() => {
    // Fonction pour récupérer les données utilisateur depuis l'API et vérifier l'authentification
    const fetchUserData = async () => {
      try {
        // Appel API pour obtenir les données utilisateur
        const response = await axios.get("/api/user/profile");
        setUser({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          avatar:
            response.data.avatar ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format",
          status: "online",
        });
        setIsAuthenticated(true);
      } catch (error) {
        // Gestion des erreurs avec l'utilitaire d'alerte
        SwalHelper(error, "Récupération des données utilisateur");
        setUser((prev) => ({ ...prev, status: "disconnected" }));
        setIsAuthenticated(false);
      }
    };

    // Fonction pour vérifier l'état de connexion en temps réel
    const checkConnectionStatus = async () => {
      if (!isAuthenticated) {
        // Si l'utilisateur n'est pas authentifié, maintient l'état déconnecté
        setUser((prev) => ({ ...prev, status: "disconnected" }));
        return;
      }
      try {
        // Appel API pour vérifier l'état de connexion
        const response = await axios.get("/api/user/status");
        setUser((prev) => ({ ...prev, status: response.data.status }));
      } catch (error) {
        // Gestion des erreurs avec l'utilitaire d'alerte
        SwalHelper(error, "Vérification de l'état de connexion");
        setUser((prev) => ({ ...prev, status: "unstable" }));
      }
    };

    // Récupération initiale des données utilisateur
    fetchUserData();

    // Configuration du polling pour l'état de connexion toutes les 10 secondes
    const intervalId = setInterval(checkConnectionStatus, 10000);

    // Nettoyage de l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId);
  }, [isAuthenticated]); // Réexécution de l'effet lorsque l'état d'authentification change

  // Fonction pour fermer tous les modaux sauf celui spécifié
  const closeAllModalsExcept = (exception = "") => {
    if (exception !== "notifications") setShowNotifications(false);
    if (exception !== "profileMenu") setShowProfileMenu(false);
    if (exception !== "profileModal") setShowProfileModal(false);
    if (exception !== "parametre") setShowParametre(false);
    if (exception !== "createEvent") setShowCreerEvent(false);
  };

  // Fonction pour gérer la déconnexion
  const logout = () => {
    // Enregistrement de l'action de déconnexion avec l'utilitaire d'alerte
    SwalHelper(new Error("Utilisateur déconnecté"), "Déconnexion");
    setUser((prev) => ({ ...prev, status: "disconnected" }));
    setIsAuthenticated(false); // Marque l'utilisateur comme non authentifié
  };

  // Fonction pour gérer la sélection d'un utilisateur depuis la recherche
  const handleSelectUser = (user) => {
    navigate(`/users/${user.id}`);
  };

  // Fonction pour obtenir la couleur de l'indicateur d'état
  const getStatusColor = () => {
    switch (user.status) {
      case "online":
        return "bg-green-500";
      case "disconnected":
        return "bg-red-500";
      case "unstable":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      {/* Conteneur de l'en-tête avec style de thème dynamique */}
      <header
        className={`relative w-full flex items-center justify-between px-8 py-4
          ${
            isDark
              ? "bg-slate-900 text-white"
              : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white"
          }
          shadow-lg border-b border-white/20
        `}
      >
        {/* Section logo et titre */}
        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Shield className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">
              {lang === "fr" ? "Tableau de bord HSE" : "HSE Dashboard"}
            </h1>
            <p className="text-sm opacity-75">
              {lang === "fr"
                ? "Santé, Sécurité & Environnement"
                : "Health, Safety & Environment"}
            </p>
          </div>
        </motion.div>

        {/* Barre de recherche */}
        <div className="flex-1 px-8">
          <UserSearchContainer
            onSelectUser={handleSelectUser}
            isDark={isDark}
            placeholder={
              lang === "fr"
                ? "Rechercher un utilisateur..."
                : "Search for a user..."
            }
          />
        </div>

        {/* Boutons d'action */}
        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Bouton de bascule de thème */}
          <motion.button
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={lang === "fr" ? "Changer le thème" : "Toggle theme"}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-300" />
            ) : (
              <Moon className="w-5 h-5 text-white" />
            )}
          </motion.button>

          {/* Menu déroulant des notifications */}
          <div className="relative z-50">
            <motion.button
              onClick={() => {
                closeAllModalsExcept("notifications");
                setShowNotifications((v) => !v);
              }}
              className="relative p-3 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={lang === "fr" ? "Notifications" : "Notifications"}
            >
              <Bell className="w-5 h-5 text-white" />
              {unreadCount > 0 && (
                <motion.span
                  className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full -top-1 -right-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {unreadCount}
                </motion.span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  className={`absolute right-0 top-full z-[100] w-80 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-600 overflow-hidden`}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600">
                    <h3 className="text-lg font-semibold text-white">
                      Notifications
                    </h3>
                  </div>
                  <div className="overflow-y-auto bg-white max-h-64 dark:bg-slate-800">
                    {notifications.map((n) => (
                      <motion.div
                        key={n.id}
                        className="p-4 border-b border-gray-100 cursor-pointer dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
                        whileHover={{ x: 5 }}
                      >
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {n.title}
                        </h4>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {n.message}
                        </p>
                        <p className="mt-2 text-xs text-gray-400">{n.time}</p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-200 bg-gray-50 dark:bg-slate-700 dark:border-slate-600">
                    <button className="w-full text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                      {lang === "fr"
                        ? "Voir toutes les notifications"
                        : "See all notifications"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bouton de création d'événement */}
          <motion.button
            onClick={() => {
              closeAllModalsExcept("createEvent");
              setShowCreerEvent(true);
            }}
            className="p-3 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={lang === "fr" ? "Créer un événement" : "Create event"}
          >
            <CalendarPlus className="w-5 h-5 text-white" />
          </motion.button>

          {/* Menu déroulant du profil avec données utilisateur dynamiques et état */}
          <div className="relative z-50">
            <motion.button
              onClick={() => {
                if (showProfileMenu) closeAllModalsExcept();
                else closeAllModalsExcept("profileMenu");
                setShowProfileMenu((v) => !v);
              }}
              className="flex items-center p-2 pr-4 space-x-3 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label={lang === "fr" ? "Profil utilisateur" : "User profile"}
            >
              <div className="relative">
                <motion.div
                  className="w-10 h-10 overflow-hidden rounded-full ring-2 ring-white/30"
                  whileHover={{ scale: 1.1 }}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="object-cover w-full h-full"
                    loading="eager"
                  />
                </motion.div>
                {/* Indicateur d'état dynamique */}
                <motion.span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${getStatusColor()} border-2 border-white`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">
                  {user.name || "Utilisateur"}
                </p>
                <p className="text-xs opacity-90">
                  {lang === "fr"
                    ? user.status === "online"
                      ? "En ligne"
                      : user.status === "disconnected"
                      ? "Déconnecté"
                      : "Connexion instable"
                    : user.status === "online"
                    ? "Online"
                    : user.status === "disconnected"
                    ? "Disconnected"
                    : "Unstable connection"}
                </p>
              </div>
            </motion.button>

            <AnimatePresence>
              {showProfileMenu && (
                <>
                  {/* Fond pour fermer le menu en cliquant à l'extérieur */}
                  <motion.div
                    key="backdrop"
                    className="fixed inset-0 z-[90] bg-black bg-opacity-30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeAllModalsExcept}
                  />
                  <motion.div
                    className="absolute right-0 top-full z-[100] w-56 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-600 overflow-hidden"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* En-tête du menu de profil avec données utilisateur dynamiques */}
                    <div className="flex items-center p-4 space-x-3 bg-gradient-to-r from-blue-500 to-purple-600">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-full ring-2 ring-white/30"
                          loading="eager"
                        />
                        {/* Indicateur d'état dynamique dans le menu de profil */}
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${getStatusColor()} border-2 border-white`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {user.name || "Utilisateur"}
                        </p>
                        <p className="text-sm text-white/90">
                          {user.email || "email@example.com"}
                        </p>
                      </div>
                    </div>

                    {/* Options du menu de profil */}
                    <div className="py-2 bg-white dark:bg-slate-800">
                      <button
                        onClick={() => {
                          setShowProfileModal(true);
                          setShowProfileMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-800 hover:bg-blue-50 dark:hover:bg-slate-700 dark:text-gray-200"
                      >
                        <User className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
                        {lang === "fr" ? "Mon Profil" : "My Profile"}
                      </button>
                      <button
                        onClick={() => {
                          setShowParametre(true);
                          setShowProfileMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-800 hover:bg-blue-50 dark:hover:bg-slate-700 dark:text-gray-200"
                      >
                        <Settings className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
                        {lang === "fr" ? "Paramètres" : "Settings"}
                      </button>
                      <hr className="my-2 border-gray-200 dark:border-slate-600" />
                      <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700"
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        {lang === "fr" ? "Déconnexion" : "Logout"}
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </header>

      {/* Modaux */}
      <Parametre
        isOpen={showParametre}
        onClose={() => setShowParametre(false)}
        onDeleteAccount={() =>
          SwalHelper(
            new Error("Suppression de compte demandée"),
            "Supprimer le compte"
          )
        }
      />
      <Profil
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userId={user.id}
        onUpdate={(updatedUser) => {
          console.log("Profil mis à jour", updatedUser);
          // Mise à jour de l'état utilisateur avec les nouvelles données
          setUser((prev) => ({ ...prev, ...updatedUser }));
        }}
      />
      <CreerEvenement
        isOpen={showCreerEvent}
        onClose={() => setShowCreerEvent(false)}
        onAdd={(newEvent) => {
          console.log("Nouvel événement créé", newEvent);
        }}
      />
    </>
  );
};

export default Header;
