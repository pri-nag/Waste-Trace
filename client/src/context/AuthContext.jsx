import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const { token: t, user: u } = res.data;
        localStorage.setItem('token', t);
        localStorage.setItem('user', JSON.stringify(u));
        setToken(t);
        setUser(u);
        return u;
    };

    const register = async (name, email, password, role) => {
        const res = await api.post('/auth/register', { name, email, password, role });
        const { token: t, user: u } = res.data;
        localStorage.setItem('token', t);
        localStorage.setItem('user', JSON.stringify(u));
        setToken(t);
        setUser(u);
        return u;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const refreshProfile = async () => {
        const res = await api.get('/auth/profile');
        const u = res.data;
        localStorage.setItem('user', JSON.stringify(u));
        setUser(u);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
