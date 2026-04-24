import { createContext, useState } from "react";
import { getProfile, logout as logoutApi } from "../services/auth.api";
import { useEffect, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await getProfile();
      const profile = res?.data?.data || null;
      setUser(profile);

      if (profile?.role === "ADMIN" && profile?.defaultStoreId) {
        localStorage.setItem("activeStoreId", String(profile.defaultStoreId));
      }

      return profile;
    } catch (error) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const res = await logoutApi();
      if (res?.data?.success) {
        setUser(null);
        localStorage.removeItem("activeStoreId");
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem("activeStoreId");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, logout, isLoggedIn: !!user, checkAuth, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};