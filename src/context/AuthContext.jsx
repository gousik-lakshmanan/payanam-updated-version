import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth`;

    useEffect(() => {
        // Check local storage for persisted session
        const storedUser = localStorage.getItem('globeTrotterUser');
        const storedToken = localStorage.getItem('globeTrotterToken');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Save to state and local storage
            setUser(data.user);
            localStorage.setItem('globeTrotterUser', JSON.stringify(data.user));
            localStorage.setItem('globeTrotterToken', data.token);

            return data.user;
        } catch (error) {
            throw error;
        }
    };

    const signup = async (name, email, password) => {
        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            // Save to state and local storage
            setUser(data.user);
            localStorage.setItem('globeTrotterUser', JSON.stringify(data.user));
            localStorage.setItem('globeTrotterToken', data.token);

            return data.user;
        } catch (error) {
            throw error;
        }
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('globeTrotterUser');
        localStorage.removeItem('globeTrotterToken');
        // Optional: Reset trips in TripContext via window reload or callback if strictly needed,
        // but typically the TripContext will react to user being null or we just reload.
        window.location.href = '/';
    };

    const updateUser = (updates) => {
        // For now, just update local state/storage. 
        // In a full app, you'd have a PUT /api/users/profile endpoint.
        setUser(prev => {
            const updated = { ...prev, ...updates };
            localStorage.setItem('globeTrotterUser', JSON.stringify(updated));
            return updated;
        });
    }

    const value = {
        user,
        login,
        signup,
        logout,
        loading,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
