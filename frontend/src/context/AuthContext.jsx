import { createContext, useState } from 'react'
import { getProfile } from '../services/auth.api';
import { useEffect, useContext } from 'react';

const AuthContext = createContext(null);

 export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await getProfile();
            setUser(res?.data?.data || null);
            
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    const logout = async () => {
        try {
            const res = await logout();
            if (res?.data?.success) {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return <AuthContext.Provider value={{ user, loading, logout, isLoggedIn: !!user, checkAuth, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};