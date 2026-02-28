// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authService.getMe()
        .then((r) => setUser(r.data.data.user))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login      = (userData, token) => { localStorage.setItem("token", token); setUser(userData); };
  const logout     = ()                => { localStorage.removeItem("token"); setUser(null); };
  const updateUser = (updates)         => setUser((p) => ({ ...p, ...updates }));

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
