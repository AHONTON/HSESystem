import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";

const UserSearchContainer = ({
  onSelectUser,
  isDark = false,
  placeholder = "Rechercher un utilisateur...",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchTerm.trim() === "") {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get(`/api/users/search?term=${searchTerm}`);
        setResults(res.data);
      } catch (err) {
        console.error("Erreur lors de la recherche utilisateur:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchUsers, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <div className="relative w-full max-w-md">
      <SearchBar
        placeholder={placeholder}
        onSearch={setSearchTerm}
        isDark={isDark}
      />
      {loading && <p className="mt-2 text-sm text-gray-500">Recherche...</p>}

      {results.length > 0 && (
        <ul
          className={`absolute z-50 mt-2 w-full rounded-lg shadow-xl overflow-hidden border ${
            isDark
              ? "bg-slate-800 border-slate-700 text-white"
              : "bg-white border-gray-200 text-gray-800"
          }`}
        >
          {results.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between px-4 py-2 transition duration-200 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-600 dark:hover:text-white"
              onClick={() => onSelectUser(user)} // Clic sur tout l’item = appel onSelectUser
            >
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {user.email}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // pour ne pas déclencher le onClick du li
                  onSelectUser(user);
                }}
                className="px-3 py-1 ml-2 text-sm text-white bg-purple-600 rounded hover:bg-purple-700"
              >
                Voir profil
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearchContainer;
