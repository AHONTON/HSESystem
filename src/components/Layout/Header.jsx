import React, { useState } from "react";
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

import { useTheme } from "../contexts/ThemeContext";
import { useLang } from "../contexts/LangContext";

import Parametre from "./Parametre";
import CreerEvenement from "./CreerEvenement";
import Profil from "./Profil";

import SearchBar from "./SearchBar";

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLang();
  const [searchTerm, setSearchTerm] = useState("");

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showParametre, setShowParametre] = useState(false);
  const [showCreerEvent, setShowCreerEvent] = useState(false);

  const user = {
    id: 1,
    name: "Jean Dupont",
    email: "jean.dupont@hse.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format",
  };
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

  const closeAllModalsExcept = (exception = "") => {
    if (exception !== "notifications") setShowNotifications(false);
    if (exception !== "profileMenu") setShowProfileMenu(false);
    if (exception !== "profileModal") setShowProfileModal(false);
    if (exception !== "parametre") setShowParametre(false);
    if (exception !== "createEvent") setShowCreerEvent(false);
  };

  const logout = () => alert("Déconnexion");

  return (
    <>
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
        {/* Logo + titre */}
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

        {/* Recherche */}
        <SearchBar
          placeholder={lang === "fr" ? "Rechercher..." : "Search..."}
          onSearch={setSearchTerm}
          isDark={isDark}
        />

        {/* Actions */}
        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Toggle thème */}
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

          {/* Notifications */}
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

          {/* Créer événement */}
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

          {/* Profil */}
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
              <div className="text-left">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs opacity-90">
                  {lang === "fr" ? "En ligne" : "Online"}
                </p>
              </div>
            </motion.button>

            <AnimatePresence>
              {showProfileMenu && (
                <>
                  {/* Fond semi-transparent pour fermer menu au clic extérieur */}
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
                    <div className="flex items-center p-4 space-x-3 bg-gradient-to-r from-blue-500 to-purple-600">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full ring-2 ring-white/30"
                        loading="eager"
                      />
                      <div>
                        <p className="font-semibold text-white">{user.name}</p>
                        <p className="text-sm text-white/90">{user.email}</p>
                      </div>
                    </div>

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

      {/* Modales */}
      <Parametre
        isOpen={showParametre}
        onClose={() => setShowParametre(false)}
        onDeleteAccount={() => alert("Supprimer compte")}
      />
      <Profil
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userId={user.id}
        onUpdate={(updatedUser) => {
          console.log("Profil mis à jour", updatedUser);
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
