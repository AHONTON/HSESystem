import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { motion } from "framer-motion";
import axios from "axios";
import PropTypes from "prop-types";
import { X, Save } from "lucide-react";
import SwalHelper from "../../utils/SwalHelper";

// Configuration de l'instance Axios avec une base URL
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Liste des équipements configurable
const defaultEquipmentList = [
  "Casque",
  "Chaussure de sécurité",
  "Gilet",
  "Gant",
  "Lunette",
  "Botte",
  "Imperméable",
];

// État initial du formulaire
const getInitialFormState = (equipmentList) => ({
  poste: "",
  pointure: "",
  équipements: equipmentList.reduce(
    (acc, item) => ({
      ...acc,
      [item]: { quantite: "", reception: "", validite: "", statut: "" },
    }),
    {}
  ),
});

// Composant pour un champ de formulaire
const FormInput = ({
  label,
  name,
  type,
  value,
  onChange,
  error,
  disabled,
  ...props
}) => (
  <div>
    <label
      htmlFor={name}
      className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-4 py-3 bg-white border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${
        error
          ? "border-red-300 focus:ring-red-500 dark:border-red-600"
          : "border-gray-300 dark:border-gray-600"
      }`}
      {...props}
    />
    {error && (
      <p className="flex items-center mt-1 text-sm text-red-500">
        <span className="mr-1">⚠️</span>
        {error}
      </p>
    )}
  </div>
);

// Composant pour une carte d'équipement
const EquipmentCard = ({
  equipement,
  data,
  errors,
  handleChange,
  getCardClass,
  getTitleClass,
  getBadgeClass,
  getStatusClass,
  disabled,
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    className={`p-5 border rounded-xl transition-all duration-200 hover:shadow-md ${getCardClass(
      data.statut
    )}`}
  >
    <div className="flex items-center justify-between mb-4">
      <h4 className={`text-lg font-semibold ${getTitleClass(data.statut)}`}>
        {equipement}
      </h4>
      {data.statut && (
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${getBadgeClass(
            data.statut
          )}`}
        >
          {data.statut}
        </span>
      )}
    </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
      <FormInput
        label="Quantité"
        type="number"
        value={data.quantite}
        onChange={(e) => handleChange(e, equipement, "quantite")}
        error={errors[equipement]}
        disabled={disabled}
        min="1"
        placeholder="Ex: 1"
      />
      <FormInput
        label="Date de réception"
        type="date"
        value={data.reception}
        onChange={(e) => handleChange(e, equipement, "reception")}
        error={errors[equipement]}
        disabled={disabled}
      />
      <FormInput
        label="Date de validité"
        type="date"
        value={data.validite}
        onChange={(e) => handleChange(e, equipement, "validite")}
        error={errors[equipement]}
        disabled={disabled}
      />
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Statut de l'équipement
        </label>
        <input
          type="text"
          value={data.statut || "Non défini"}
          disabled
          className={`w-full px-3 py-2 border rounded-md font-medium ${getStatusClass(
            data.statut
          )}`}
        />
      </div>
    </div>
    {errors[equipement] && (
      <div className="p-3 mt-3 border border-red-200 rounded-md bg-red-50 dark:bg-red-900/20 dark:border-red-800">
        <p className="flex items-center text-sm text-red-600 dark:text-red-400">
          <span className="mr-2">⚠️</span>
          {errors[equipement]}
        </p>
      </div>
    )}
  </motion.div>
);

const EquipmentForm = ({
  userId,
  onClose,
  equipmentList = defaultEquipmentList,
}) => {
  const [form, setForm] = useState(getInitialFormState(equipmentList));
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const notifiedRef = useRef({ Jmoins1: new Set(), JourJ: new Set() });

  // Demande de permission pour les notifications
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Fonction pour récupérer les données d'un utilisateur spécifique
  const fetchUserEquipment = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      // GET: Récupère les données des équipements pour un utilisateur spécifique
      const response = await api.get(`/utilisateurs/${userId}/equipements`);
      setForm(response.data || getInitialFormState(equipmentList));
      notifiedRef.current.Jmoins1.clear();
      notifiedRef.current.JourJ.clear();
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      SwalHelper.error("Erreur", "Impossible de charger les équipements");
      setForm(getInitialFormState(equipmentList));
    } finally {
      setIsLoading(false);
    }
  }, [userId, equipmentList]);

  // Charger les données au montage du composant
  useEffect(() => {
    fetchUserEquipment();
  }, [fetchUserEquipment]);

  // Fonction pour créer un nouvel enregistrement d'équipement
  const createEquipment = useCallback(
    async (equipmentData) => {
      try {
        // POST: Crée un nouvel enregistrement d'équipement pour l'utilisateur
        await api.post(`/utilisateurs/${userId}/equipements`, equipmentData);
        await SwalHelper.success(
          "Succès",
          "Les équipements ont été créés avec succès."
        );
        return true;
      } catch (error) {
        console.error("Erreur lors de la création:", error);
        await SwalHelper.error(
          "Erreur",
          error.response?.data?.message ||
            "Une erreur est survenue lors de la création."
        );
        return false;
      }
    },
    [userId]
  );

  // Fonction pour mettre à jour un enregistrement d'équipement existant
  const updateEquipment = useCallback(
    async (equipmentData) => {
      try {
        // PUT: Met à jour les données des équipements pour l'utilisateur
        await api.put(`/utilisateurs/${userId}/equipements`, equipmentData);
        await SwalHelper.success(
          "Succès",
          "Les équipements ont été mis à jour avec succès."
        );
        return true;
      } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
        await SwalHelper.error(
          "Erreur",
          error.response?.data?.message ||
            "Une erreur est survenue lors de la mise à jour."
        );
        return false;
      }
    },
    [userId]
  );

  // Fonction pour supprimer un enregistrement d'équipement
  const deleteEquipment = useCallback(
    async (equipmentId) => {
      try {
        // DELETE: Supprime un équipement spécifique
        await api.delete(`/utilisateurs/${userId}/equipements/${equipmentId}`);
        await SwalHelper.success(
          "Succès",
          "L'équipement a été supprimé avec succès."
        );
        return true;
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        await SwalHelper.error(
          "Erreur",
          error.response?.data?.message ||
            "Une erreur est survenue lors de la suppression."
        );
        return false;
      }
    },
    [userId]
  );

  // Déclencheur de notification
  const triggerBrowserNotification = useCallback((title, body) => {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
      });
    }
  }, []);

  // Mise à jour des statuts et notifications
  const updateStatusesAndNotify = useCallback(() => {
    const now = new Date();
    const updated = { ...form.équipements };
    let hasChanges = false;

    equipmentList.forEach((equipement) => {
      const { validite, reception } = form.équipements[equipement];
      if (!validite || !reception) {
        if (updated[equipement].statut !== "") {
          updated[equipement].statut = "";
          hasChanges = true;
        }
        return;
      }

      const dValidite = new Date(validite);
      const diffDays = Math.ceil((dValidite - now) / (1000 * 60 * 60 * 24));
      let newStatus = "";

      if (diffDays < 0) {
        newStatus = "Expiré";
        if (!notifiedRef.current.JourJ.has(equipement)) {
          SwalHelper.custom({
            icon: "error",
            title: "Matériel expiré",
            text: `${equipement} est arrivé à expiration.`,
            confirmButtonText: "Compris",
          });
          triggerBrowserNotification(
            "⚠️ Matériel expiré",
            `${equipement} est expiré depuis ${Math.abs(diffDays)} jour(s).`
          );
          notifiedRef.current.JourJ.add(equipement);
        }
      } else if (diffDays === 0) {
        newStatus = "Expire aujourd'hui";
        if (!notifiedRef.current.JourJ.has(equipement)) {
          SwalHelper.custom({
            icon: "warning",
            title: "Expiration aujourd'hui",
            text: `${equipement} expire aujourd'hui !`,
            confirmButtonText: "Compris",
          });
          triggerBrowserNotification(
            "⚠️ Expiration aujourd'hui",
            `${equipement} expire aujourd'hui !`
          );
          notifiedRef.current.JourJ.add(equipement);
        }
      } else if (diffDays === 1) {
        newStatus = "Expire demain";
        if (!notifiedRef.current.Jmoins1.has(equipement)) {
          SwalHelper.custom({
            icon: "info",
            title: `Expiration proche - ${equipement}`,
            text: `Le matériel ${equipement} expirera demain.`,
            confirmButtonText: "Compris",
          });
          triggerBrowserNotification(
            "📅 Expiration proche",
            `${equipement} expirera demain.`
          );
          notifiedRef.current.Jmoins1.add(equipement);
        }
      } else if (diffDays <= 7) {
        newStatus = `Expire dans ${diffDays} jours`;
      } else {
        newStatus = `Valide (${diffDays} jours restants)`;
      }

      if (updated[equipement].statut !== newStatus) {
        updated[equipement].statut = newStatus;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setForm((prev) => ({ ...prev, équipements: updated }));
    }
  }, [form.équipements, equipmentList, triggerBrowserNotification]);

  // Calcul du temps jusqu'à minuit
  const getMsUntilMidnight = useCallback(() => {
    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0,
      0
    );
    return midnight - now;
  }, []);

  // Mise à jour périodique des statuts
  useEffect(() => {
    updateStatusesAndNotify();
    const timeoutId = setTimeout(() => {
      updateStatusesAndNotify();
      const intervalId = setInterval(() => {
        notifiedRef.current.Jmoins1.clear();
        notifiedRef.current.JourJ.clear();
        updateStatusesAndNotify();
      }, 24 * 60 * 60 * 1000);
      return () => clearInterval(intervalId);
    }, getMsUntilMidnight());

    return () => clearTimeout(timeoutId);
  }, [updateStatusesAndNotify, getMsUntilMidnight]);

  // Validation du formulaire
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!form.poste.trim()) {
      newErrors.poste = "Le poste est requis.";
    }

    if (!form.pointure || Number(form.pointure) <= 0) {
      newErrors.pointure = "La pointure est requise et doit être positive.";
    }

    equipmentList.forEach((eq) => {
      const { quantite, reception, validite } = form.équipements[eq];

      if (!quantite || Number(quantite) <= 0) {
        newErrors[
          eq
        ] = `La quantité est requise et doit être positive pour ${eq}.`;
      } else if (!reception || !validite) {
        newErrors[
          eq
        ] = `Les dates de réception et validité sont requises pour ${eq}.`;
      } else {
        const dateReception = new Date(reception);
        const dateValidite = new Date(validite);
        if (dateValidite <= dateReception) {
          newErrors[
            eq
          ] = `La date de validité doit être postérieure à la date de réception pour ${eq}.`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form, equipmentList]);

  // Gestion des changements des champs d'équipement
  const handleChange = useCallback((e, equipement, field) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      équipements: {
        ...prev.équipements,
        [equipement]: {
          ...prev.équipements[equipement],
          [field]: value,
        },
      },
    }));
    setErrors((prev) => ({ ...prev, [equipement]: undefined }));
  }, []);

  // Gestion des changements des champs généraux
  const handleBaseChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  // Soumission du formulaire
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm()) {
        SwalHelper.error(
          "Erreur de validation",
          "Veuillez corriger les erreurs avant de continuer."
        );
        return;
      }

      setIsLoading(true);
      try {
        await SwalHelper.loading("Enregistrement...", "Veuillez patienter");
        // Vérifie si des données existent déjà pour déterminer si c'est une création ou une mise à jour
        const response = await api.get(`/utilisateurs/${userId}/equipements`);
        if (response.data) {
          // Si des données existent, on met à jour
          await updateEquipment(form);
        } else {
          // Sinon, on crée un nouvel enregistrement
          await createEquipment(form);
        }
        onClose();
      } catch (err) {
        console.error("Erreur lors de l'enregistrement:", err);
        await SwalHelper.error(
          "Erreur",
          err.response?.data?.message ||
            "Une erreur est survenue lors de l'enregistrement."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [form, userId, onClose, validateForm, createEquipment, updateEquipment]
  );

  // Classes CSS pour les statuts
  const getStatusClass = useCallback((statut) => {
    if (!statut)
      return "bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300";
    if (statut === "Expiré")
      return "bg-red-100 border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-600 dark:text-red-300";
    if (statut === "Expire aujourd'hui" || statut === "Expire demain")
      return "bg-orange-100 border-orange-300 text-orange-700 dark:bg-orange-900/30 dark:border-orange-600 dark:text-orange-300";
    if (
      statut.includes("Expire dans") &&
      parseInt(statut.match(/\d+/)?.[0]) <= 7
    )
      return "bg-yellow-100 border-yellow-300 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-600 dark:text-yellow-300";
    return "bg-green-100 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-600 dark:text-green-300";
  }, []);

  const getCardClass = useCallback((statut) => {
    if (!statut)
      return "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800";
    if (statut === "Expiré")
      return "border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20";
    if (statut === "Expire aujourd'hui" || statut === "Expire demain")
      return "border-orange-300 bg-orange-50 dark:border-orange-600 dark:bg-orange-900/20";
    if (
      statut.includes("Expire dans") &&
      parseInt(statut.match(/\d+/)?.[0]) <= 7
    )
      return "border-yellow-300 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-900/20";
    return "border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20";
  }, []);

  const getTitleClass = useCallback((statut) => {
    if (!statut) return "text-blue-600 dark:text-blue-400";
    if (statut === "Expiré") return "text-red-600 dark:text-red-400";
    if (statut === "Expire aujourd'hui" || statut === "Expire demain")
      return "text-orange-600 dark:text-orange-400";
    if (
      statut.includes("Expire dans") &&
      parseInt(statut.match(/\d+/)?.[0]) <= 7
    )
      return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  }, []);

  const getBadgeClass = useCallback((statut) => {
    if (!statut)
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
    if (statut === "Expiré")
      return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
    if (statut === "Expire aujourd'hui" || statut === "Expire demain")
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300";
    if (
      statut.includes("Expire dans") &&
      parseInt(statut.match(/\d+/)?.[0]) <= 7
    )
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
    return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
  }, []);

  // Mémorisation des équipements pour éviter les rendus inutiles
  const equipmentCards = useMemo(
    () =>
      equipmentList.map((equipement, index) => (
        <div key={equipement} className="relative">
          <EquipmentCard
            equipement={equipement}
            data={form.équipements[equipement]}
            errors={errors}
            handleChange={handleChange}
            getCardClass={getCardClass}
            getTitleClass={getTitleClass}
            getBadgeClass={getBadgeClass}
            getStatusClass={getStatusClass}
            disabled={isLoading}
            index={index}
          />
          {/* Bouton de suppression pour chaque équipement */}
          <button
            type="button"
            onClick={() => deleteEquipment(equipement)}
            disabled={isLoading}
            className="absolute top-2 right-2 p-1 text-white bg-red-600 rounded-full hover:bg-red-700 disabled:opacity-50"
            aria-label={`Supprimer ${equipement}`}
          >
            <X size={16} />
          </button>
        </div>
      )),
    [
      equipmentList,
      form.équipements,
      errors,
      handleChange,
      getCardClass,
      getTitleClass,
      getBadgeClass,
      getStatusClass,
      isLoading,
      deleteEquipment,
    ]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-4 border-blue-900 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Chargement des équipements...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-[70vh] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-1xl font-bold text-gray-800 dark:text-white">
            BIONS PARTHNERSHIP | Gestion des Équipements
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-white bg-red-600"
            type="button"
            disabled={isLoading}
            aria-label="Fermer"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations générales */}
          <div className="p-6 border border-gray-300 dark:border-gray-600 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <h3 className="flex items-center mb-6 text-lg font-semibold text-blue-600 dark:text-blue-400">
              <span className="w-2 h-2 mr-2 bg-blue-600 rounded-full dark:bg-blue-400"></span>
              Informations générales
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormInput
                label="Poste"
                type="text"
                name="poste"
                value={form.poste}
                onChange={handleBaseChange}
                error={errors.poste}
                disabled={isLoading}
                placeholder="Ex : Soudeur, Électricien, Mécanicien..."
              />
              <FormInput
                label="Pointure"
                type="number"
                name="pointure"
                value={form.pointure}
                onChange={handleBaseChange}
                error={errors.pointure}
                disabled={isLoading}
                placeholder="Ex : 42"
                min="30"
                max="50"
              />
            </div>
          </div>

          {/* Liste des équipements */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Équipements de Protection Individuelle
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {equipmentList.length} équipements
              </span>
            </div>
            {equipmentCards}
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end pt-6 space-x-4 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 text-white transition-all duration-200 bg-red-800 rounded-lg disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <motion.button
              whileHover={isLoading ? {} : { scale: 1.02 }}
              whileTap={isLoading ? {} : { scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="flex items-center px-8 py-3 space-x-2 font-semibold text-white transition-all duration-200 bg-green-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Enregistrer</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

EquipmentForm.propTypes = {
  userId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  equipmentList: PropTypes.arrayOf(PropTypes.string),
};

export default EquipmentForm;
