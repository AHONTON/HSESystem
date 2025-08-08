import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import Card from "../components/UI/Card";
import Modal from "../components/UI/Modal";
import { users } from "../data/users.json";
import SwalHelper from "../utils/SwalHelper";
import EquipmentForm from "../components/UI/EquipmentForm";

const Users = () => {
  const [userList, setUserList] = useState(users);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // add, edit, view
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [userForEquipment, setUserForEquipment] = useState(null);

  const filteredUsers = userList.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleOpenEquipment = (user) => {
    setUserForEquipment(user);
    setShowEquipmentModal(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setModalMode("add");
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalMode("view");
    setShowModal(true);
  };

  const handleDeleteUser = (user) => {
    SwalHelper.confirm(
      "Êtes-vous sûr ?",
      `Voulez-vous vraiment supprimer l'utilisateur ${user.name} ?`,
      "Oui, supprimer"
    ).then((result) => {
      if (result.isConfirmed) {
        setUserList((prev) => prev.filter((u) => u.id !== user.id));
        SwalHelper.success("Supprimé !", "L'utilisateur a été supprimé.");
      }
    });
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: "badge badge-danger",
      superviseur: "badge badge-warning",
      technicien: "badge badge-success",
    };
    return badges[role] || "badge";
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: "Administrateur",
      superviseur: "Superviseur",
      technicien: "Technicien",
    };
    return labels[role] || role;
  };

  const UserForm = ({ user, mode, onSave, onClose }) => {
    const [formData, setFormData] = useState(
      user || {
        name: "",
        email: "",
        role: "technicien",
        phone: "",
        position: "",
        department: "",
      }
    );

    const handleSubmit = (e) => {
      e.preventDefault();
      if (mode === "add") {
        const newUser = {
          ...formData,
          id: Date.now(),
          joinDate: new Date().toISOString().split("T")[0],
          avatar: `/placeholder.svg?height=40&width=40&query=${formData.name}`,
        };
        setUserList((prev) => [...prev, newUser]);
        SwalHelper.success(
          "Ajouté !",
          "L'utilisateur a été ajouté avec succès."
        );
      } else if (mode === "edit") {
        setUserList((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, ...formData } : u))
        );
        SwalHelper.success(
          "Modifié !",
          "L'utilisateur a été modifié avec succès."
        );
      }
      onClose();
      onSave();
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
                {user.phone}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Poste
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {user.position}
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
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nom complet
            </label>
            <input
              type="text"
              required
              className="mt-1 input-field"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              required
              className="mt-1 input-field"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Rôle
            </label>
            <select
              className="mt-1 input-field"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
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
              className="mt-1 input-field"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Poste
            </label>
            <input
              type="text"
              className="mt-1 input-field"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Département
            </label>
            <input
              type="text"
              className="mt-1 input-field"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 space-x-3">
          <button type="button" onClick={onClose} className="btn-secondary">
            Annuler
          </button>
          <button type="submit" className="btn-primary">
            {mode === "add" ? "Ajouter" : "Modifier"}
          </button>
        </div>
      </form>
    );
  };

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
            Gestion des Utilisateurs
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Gérez les comptes utilisateurs et leurs permissions
          </p>
        </div>
        <motion.button
          onClick={handleAddUser}
          className="flex items-center space-x-2 btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={20} />
          <span>Nouvel utilisateur</span>
        </motion.button>
      </motion.div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                className="pl-10 input-field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="input-field"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">Tous les rôles</option>
              <option value="admin">Administrateur</option>
              <option value="superviseur">Superviseur</option>
              <option value="technicien">Technicien</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Rôle
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Département
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Date d'embauche
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400">
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
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                      {user.department}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <div className="flex justify-end space-x-2">
                        <motion.button
                          onClick={() => handleViewUser(user)}
                          className="p-1 text-primary-600 hover:text-primary-900"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Voir"
                        >
                          <Eye size={16} />
                        </motion.button>
                        <motion.button
                          onClick={() => handleEditUser(user)}
                          className="p-1 text-warning-600 hover:text-warning-900"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1 text-danger-600 hover:text-danger-900"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </motion.button>

                        <motion.button
                          onClick={() => handleOpenEquipment(user)}
                          className="px-3 py-1 font-medium text-white bg-green-900 rounded-md hover:bg-green-900"
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
            <Users className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Aucun utilisateur trouvé
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Aucun utilisateur ne correspond à vos critères de recherche.
            </p>
          </div>
        )}
      </Card>

      {/* Modal utilisateur */}
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
        <UserForm
          user={selectedUser}
          mode={modalMode}
          onSave={() => setShowModal(false)}
          onClose={() => setShowModal(false)}
        />
      </Modal>

      {/* Modal équipement */}
      <Modal
        isOpen={showEquipmentModal}
        onClose={() => setShowEquipmentModal(false)}
        title={`Équipements de ${userForEquipment?.name || ""}`}
        size=""
      >
        <EquipmentForm
          user={userForEquipment}
          onClose={() => setShowEquipmentModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Users;
