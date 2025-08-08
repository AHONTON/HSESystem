import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Users as UsersIcon,
} from "lucide-react";
import axios from "axios";
import Card from "../components/UI/Card";
import Modal from "../components/UI/Modal";
import SwalHelper from "../utils/SwalHelper";
import EquipmentForm from "../components/UI/EquipmentForm";
import NewUserForm from "../components/UI/NewUserForm";
import ExportButtons from "../components/UI/ExportButtons";

const UserForm = ({ user, mode, onSave, onClose }) => {
  const [formData, setFormData] = useState(
    user || {
      name: "",
      email: "",
      role: "technicien",
      phone: "",
      poste: "",
      department: "",
    }
  );
  const [errors, setErrors] = useState({});

  // Validate form data before submission
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Le nom complet est requis";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Un email valide est requis";
    if (
      formData.phone &&
      !/^\+?\d{10,15}$/.test(formData.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone =
        "Le numéro de téléphone doit contenir entre 10 et 15 chiffres";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission for editing a user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (mode === "edit") {
      // Update user: Send PUT request to update user data
      try {
        await axios.put(`/api/users/${user.id}`, formData);
        onSave({ ...user, ...formData });
        SwalHelper.success(
          "Modifié !",
          "L'utilisateur a été modifié avec succès."
        );
        onClose();
      } catch (error) {
        SwalHelper.error(
          "Erreur",
          "Une erreur s'est produite lors de la modification de l'utilisateur."
        );
      }
    }
  };

  if (mode === "view") {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {user.name}
            </h3>
            <span className={getRoleBadge(user.role)}>
              {getRoleLabel(user.role)}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {user.email}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Téléphone
            </label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {user.phone || "-"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Poste
            </label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {user.poste || "-"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Département
            </label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {user.department}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date d'embauche
            </label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {new Date(user.joinDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nom complet
          </label>
          <input
            type="text"
            required
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.name ? "border-red-500" : ""
            }`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            required
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.email ? "border-red-500" : ""
            }`}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Rôle
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="technicien">Technicien</option>
            <option value="superviseur">Superviseur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Téléphone
          </label>
          <input
            type="tel"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.phone ? "border-red-500" : ""
            }`}
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Poste
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.poste}
            onChange={(e) =>
              setFormData({ ...formData, poste: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Département
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
          />
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Modifier
        </button>
      </div>
    </form>
  );
};

// Utility function to get role badge styling
const getRoleBadge = (role) => {
  const badges = {
    admin:
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800",
    superviseur:
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800",
    technicien:
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800",
  };
  return (
    badges[role] ||
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
  );
};

// Utility function to get role label
const getRoleLabel = (role) => {
  const labels = {
    admin: "Administrateur",
    superviseur: "Superviseur",
    technicien: "Technicien",
  };
  return labels[role] || role;
};

const Users = () => {
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [userForEquipment, setUserForEquipment] = useState(null);

  const modalRef = useRef(null);
  const equipmentModalRef = useRef(null);

  // Fetch users: Load all users from API on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        setUserList(response.data);
      } catch (error) {
        SwalHelper.error(
          "Erreur",
          "Une erreur s'est produite lors du chargement des utilisateurs."
        );
      }
    };
    fetchUsers();
  }, []);

  // Handle clicks outside modals to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setShowModal(false);
      }
      if (
        showEquipmentModal &&
        equipmentModalRef.current &&
        !equipmentModalRef.current.contains(event.target)
      ) {
        setShowEquipmentModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal, showEquipmentModal]);

  // Filter users based on search term and role
  const filteredUsers = userList.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Open equipment modal for a specific user
  const handleOpenEquipment = (user) => {
    setUserForEquipment(user);
    setShowEquipmentModal(true);
  };

  // Open modal to add a new user
  const handleAddUser = () => {
    setModalMode("add");
    setShowModal(true);
  };

  // Open modal to edit an existing user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalMode("edit");
    setShowModal(true);
  };

  // Open modal to view user details
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalMode("view");
    setShowModal(true);
  };

  // Delete user: Send DELETE request to remove a user
  const handleDeleteUser = async (user) => {
    SwalHelper.confirm(
      "Êtes-vous sûr ?",
      `Voulez-vous vraiment supprimer l'utilisateur ${user.name} ?`,
      "Oui, supprimer"
    ).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/users/${user.id}`);
          setUserList((prev) => prev.filter((u) => u.id !== user.id));
          SwalHelper.success("Supprimé !", "L'utilisateur a été supprimé.");
        } catch (error) {
          SwalHelper.error(
            "Erreur",
            "Une erreur s'est produite lors de la suppression de l'utilisateur."
          );
        }
      }
    });
  };

  // Save user: Handle both adding and editing users via API
  const handleSaveUser = async (userData) => {
    try {
      if (modalMode === "add") {
        // Create user: Send POST request to add a new user
        const response = await axios.post("/api/users", userData);
        setUserList((prev) => [...prev, response.data]);
        SwalHelper.success(
          "Ajouté !",
          "L'utilisateur a été ajouté avec succès."
        );
      } else if (modalMode === "edit") {
        // Update user: Send PUT request to update an existing user
        await axios.put(`/api/users/${userData.id}`, userData);
        setUserList((prev) =>
          prev.map((u) => (u.id === userData.id ? userData : u))
        );
        SwalHelper.success(
          "Modifié !",
          "L'utilisateur a été modifié avec succès."
        );
      }
      setShowModal(false);
    } catch (error) {
      SwalHelper.error(
        "Erreur",
        `Une erreur s'est produite lors de ${
          modalMode === "add" ? "l'ajout" : "la modification"
        } de l'utilisateur.`
      );
    }
  };

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
            Gestion des Utilisateurs
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Gérez les comptes utilisateurs et leurs permissions
          </p>
        </div>
        <motion.button
          onClick={handleAddUser}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={20} />
          <span>Nouvel utilisateur</span>
        </motion.button>
      </motion.div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="w-full sm:w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">Tous les rôles</option>
              <option value="admin">Administrateur</option>
              <option value="superviseur">Superviseur</option>
              <option value="technicien">Technicien</option>
            </select>
          </div>
          <ExportButtons userList={userList} getRoleLabel={getRoleLabel} />
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Département
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Date d'embauche
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              <AnimatePresence>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="w-10 h-10 rounded-full"
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getRoleBadge(user.role)}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {user.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <motion.button
                          onClick={() => handleViewUser(user)}
                          className="p-1 text-blue-600 hover:text-blue-900"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Voir"
                        >
                          <Eye size={16} />
                        </motion.button>
                        <motion.button
                          onClick={() => handleEditUser(user)}
                          className="p-1 text-yellow-600 hover:text-yellow-900"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1 text-red-600 hover:text-red-900"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                        <motion.button
                          onClick={() => handleOpenEquipment(user)}
                          className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Gérer les équipements"
                        >
                          Équipement
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <UsersIcon className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Aucun utilisateur trouvé
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Aucun utilisateur ne correspond à vos critères de recherche.
            </p>
          </div>
        )}
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalMode === "add"
            ? "Nouvel utilisateur"
            : modalMode === "edit"
            ? "Modifier l'utilisateur"
            : "Détails de l'utilisateur"
        }
        size="lg"
      >
        <div ref={modalRef}>
          {modalMode === "add" ? (
            <NewUserForm
              onSave={handleSaveUser}
              onClose={() => setShowModal(false)}
            />
          ) : (
            <UserForm
              user={selectedUser}
              mode={modalMode}
              onSave={handleSaveUser}
              onClose={() => setShowModal(false)}
            />
          )}
        </div>
      </Modal>

      <Modal
        isOpen={showEquipmentModal}
        onClose={() => setShowEquipmentModal(false)}
        title={`Équipements de ${userForEquipment?.name || ""}`}
        size="lg"
      >
        <div ref={equipmentModalRef}>
          <EquipmentForm
            user={userForEquipment}
            onClose={() => setShowEquipmentModal(false)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Users;
