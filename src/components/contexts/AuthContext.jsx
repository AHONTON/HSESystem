import { createContext, useContext, useState } from "react";
import axios from "axios";

// Création du contexte d'authentification
const AuthContext = createContext();

// Fournisseur d'authentification global
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Connexion utilisateur (POST vers ton API backend)
  const login = async ({ email, password }) => {
    const res = await axios.post("/api/login", { email, password });
    setUser(res.data.user);
  };

  // Déconnexion utilisateur
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour accéder au contexte d'authentification
export const useAuth = () => useContext(AuthContext);
