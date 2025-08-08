import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Calendar,
  User,
  Package,
  RefreshCw,
  Bell,
  BellOff,
  Edit,
  Download,
} from "lucide-react";
import axios from "axios";
import Card from "../components/UI/Card";
import Modal from "../components/UI/Modal";
import EquipmentForm from "../components/UI/EquipmentForm";
import SwalHelper from "../utils/SwalHelper";

// Configuration de la base URL pour Axios
axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Composant pour les alertes
const AlertCard = ({ type, count, onClick }) => {
  const alertConfig = {
    expired: {
      icon: XCircle,
      color: "red",
      title: "Équipements expirés",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      textColor: "text-red-700 dark:text-red-400",
      iconColor: "text-red-500",
    },
    today: {
      icon: AlertTriangle,
      color: "orange",
      title: "Expirent aujourd'hui",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
      textColor: "text-orange-700 dark:text-orange-400",
      iconColor: "text-orange-500",
    },
    soon: {
      icon: Clock,
      color: "yellow",
      title: "Expirent bientôt (≤7j)",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      textColor: "text-yellow-700 dark:text-yellow-400",
      iconColor: "text-yellow-500",
    },
    valid: {
      icon: CheckCircle,
      color: "green",
      title: "Équipements valides",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      textColor: "text-green-700 dark:text-green-400",
      iconColor: "text-green-500",
    },
  };

  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${config.bgColor} ${config.borderColor} hover:shadow-lg`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${config.textColor}`}>
            {config.title}
          </p>
          <p className={`text-2xl font-bold mt-1 ${config.textColor}`}>
            {count}
          </p>
        </div>
        <Icon className={`w-8 h-8 ${config.iconColor}`} />
      </div>
    </motion.div>
  );
};

// Composant pour une ligne d'équipement
const EquipmentRow = ({ userEquipment, equipment, data, onEdit }) => {
  const getStatusBadge = (statut) => {
    if (!statut) return "bg-gray-100 text-gray-700";
    if (statut === "Expiré") return "bg-red-100 text-red-700 border-red-300";
    if (statut === "Expire aujourd'hui")
      return "bg-orange-100 text-orange-700 border-orange-300";
    if (statut === "Expire demain" || statut.includes("Expire dans")) {
      const days = parseInt(statut.match(/\d+/)?.[0]) || 0;
      if (days <= 7) return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
    return "bg-green-100 text-green-700 border-green-300";
  };

  const isAlert =
    data.statut?.includes("Expiré") ||
    data.statut?.includes("Expire aujourd'hui") ||
    data.statut?.includes("Expire demain") ||
    (data.statut?.includes("Expire dans") &&
      parseInt(data.statut.match(/\d+/)?.[0]) <= 7);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
        isAlert ? "bg-red-50 dark:bg-red-900/10" : ""
      }`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {isAlert && (
            <Bell className="w-4 h-4 text-red-500 mr-2 animate-pulse" />
          )}
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {userEquipment.userName}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {userEquipment.poste}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Package className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {equipment}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {data.quantite}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {new Date(data.reception).toLocaleDateString("fr-FR")}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {new Date(data.validite).toLocaleDateString("fr-FR")}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
            data.statut
          )}`}
        >
          {data.statut || "Non défini"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(userEquipment)}
            className="p-1 text-blue-600 hover:text-blue-900"
            title="Modifier"
          >
            <Edit size={16} />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

const Equipement = () => {
  const [equipmentData, setEquipmentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);

  // Charger les données des équipements depuis l'API
  useEffect(() => {
    const loadEquipmentData = async () => {
      setIsLoading(true);
      try {
        // Appel API pour récupérer la liste des équipements
        const response = await axios.get("/equipments", {
          timeout: 5000,
        });
        setEquipmentData(response.data);
        SwalHelper.success(
          "Succès",
          "Données des équipements chargées avec succès"
        );
      } catch (error) {
        console.error("Erreur lors du chargement des équipements:", error);
        SwalHelper.error("Erreur", "Impossible de charger les équipements");
      } finally {
        setIsLoading(false);
      }
    };

    loadEquipmentData();
  }, []);

  // Transformation des données pour l'affichage
  const flattenedEquipments = useMemo(() => {
    const flattened = [];
    equipmentData.forEach((userEquipment) => {
      Object.entries(userEquipment.équipements).forEach(([equipment, data]) => {
        if (data.quantite && data.reception && data.validite) {
          flattened.push({
            userEquipment,
            equipment,
            data,
            searchKey:
              `${userEquipment.userName} ${equipment} ${userEquipment.poste}`.toLowerCase(),
          });
        }
      });
    });
    return flattened;
  }, [equipmentData]);

  // Filtrage des équipements
  const filteredEquipments = useMemo(() => {
    return flattenedEquipments.filter((item) => {
      const matchesSearch = item.searchKey.includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "expired" && item.data.statut?.includes("Expiré")) ||
        (statusFilter === "today" &&
          item.data.statut?.includes("Expire aujourd'hui")) ||
        (statusFilter === "soon" &&
          (item.data.statut?.includes("Expire demain") ||
            (item.data.statut?.includes("Expire dans") &&
              parseInt(item.data.statut.match(/\d+/)?.[0]) <= 7))) ||
        (statusFilter === "valid" && item.data.statut?.includes("Valide"));

      const matchesUser =
        userFilter === "all" || item.userEquipment.userId === userFilter;

      return matchesSearch && matchesStatus && matchesUser;
    });
  }, [flattenedEquipments, searchTerm, statusFilter, userFilter]);

  // Calcul des statistiques
  const stats = useMemo(() => {
    const expired = flattenedEquipments.filter((item) =>
      item.data.statut?.includes("Expiré")
    ).length;
    const today = flattenedEquipments.filter((item) =>
      item.data.statut?.includes("Expire aujourd'hui")
    ).length;
    const soon = flattenedEquipments.filter(
      (item) =>
        item.data.statut?.includes("Expire demain") ||
        (item.data.statut?.includes("Expire dans") &&
          parseInt(item.data.statut.match(/\d+/)?.[0]) <= 7)
    ).length;
    const valid = flattenedEquipments.filter((item) =>
      item.data.statut?.includes("Valide")
    ).length;

    return { expired, today, soon, valid };
  }, [flattenedEquipments]);

  // Liste unique des utilisateurs pour le filtre
  const uniqueUsers = useMemo(() => {
    const users = equipmentData.map((user) => ({
      id: user.userId,
      name: user.userName,
    }));
    return users.filter(
      (user, index, self) => self.findIndex((u) => u.id === user.id) === index
    );
  }, [equipmentData]);

  // Gérer l'édition d'un utilisateur
  const handleEdit = (userEquipment) => {
    setSelectedUser(userEquipment);
    setShowModal(true);
  };

  // Rafraîchir les données via l'API
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Appel API pour recharger les données des équipements
      const response = await axios.get("/equipments", {
        timeout: 5000,
      });
      setEquipmentData(response.data);
      SwalHelper.success("Actualisé", "Les données ont été mises à jour");
    } catch (error) {
      console.error("Erreur lors de l'actualisation:", error);
      SwalHelper.error("Erreur", "Impossible d'actualiser les données");
    } finally {
      setIsLoading(false);
    }
  };

  // Exporter les données via l'API
  const exportData = async () => {
    try {
      // Appel API pour générer un export CSV
      const response = await axios.get("/equipments/export", {
        responseType: "blob",
        timeout: 5000,
      });
      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "equipements.csv";
      link.click();
      SwalHelper.success("Succès", "Exportation des données réussie");
    } catch (error) {
      console.error("Erreur lors de l'exportation:", error);
      SwalHelper.error("Erreur", "Impossible d'exporter les données");
    }
  };

  if (isLoading && equipmentData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Chargement des équipements...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des Équipements
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Suivi et gestion des équipements de protection individuelle
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-md ${
              showNotifications
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Activer/Désactiver les notifications"
          >
            {showNotifications ? <Bell size={20} /> : <BellOff size={20} />}
          </motion.button>
          <motion.button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            <span>Actualiser</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Cartes d'alertes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AlertCard
          type="expired"
          count={stats.expired}
          onClick={() => setStatusFilter("expired")}
        />
        <AlertCard
          type="today"
          count={stats.today}
          onClick={() => setStatusFilter("today")}
        />
        <AlertCard
          type="soon"
          count={stats.soon}
          onClick={() => setStatusFilter("soon")}
        />
        <AlertCard
          type="valid"
          count={stats.valid}
          onClick={() => setStatusFilter("valid")}
        />
      </div>

      {/* Filtres */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-center w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="w-full sm:w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="expired">Expirés</option>
              <option value="today">Expirent aujourd'hui</option>
              <option value="soon">Expirent bientôt</option>
              <option value="valid">Valides</option>
            </select>
            <select
              className="w-full sm:w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            >
              <option value="all">Tous les utilisateurs</option>
              {uniqueUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <motion.button
            onClick={exportData}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download size={16} />
            <span>Exporter</span>
          </motion.button>
        </div>
      </Card>

      {/* Table des équipements */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Utilisateur
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Équipement
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Quantité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Réception
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Validité
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              <AnimatePresence>
                {filteredEquipments.map((item, index) => (
                  <EquipmentRow
                    key={`${item.userEquipment.userId}-${item.equipment}`}
                    userEquipment={item.userEquipment}
                    equipment={item.equipment}
                    data={item.data}
                    onEdit={handleEdit}
                  />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filteredEquipments.length === 0 && (
          <div className="py-12 text-center">
            <Package className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Aucun équipement trouvé
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Aucun équipement ne correspond à vos critères de recherche.
            </p>
          </div>
        )}
      </Card>

      {/* Modal pour l'édition */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Équipements de ${selectedUser?.userName || ""}`}
        size="lg"
      >
        {selectedUser && (
          <EquipmentForm
            userId={selectedUser.userId}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              // Recharger les données après une mise à jour réussie
              handleRefresh();
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Equipement;
