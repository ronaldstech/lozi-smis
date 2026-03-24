import React, { createContext, useState, useEffect, useContext } from 'react';

export const AppContext = createContext({});
import { API_URL } from '../config';

export const AppProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        return storedAuth === 'true';
    });

    // Initialize user state from localStorage if available
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : {
            id: 0,
            username: "user",
            email: "user@gmail.com",
            picture: "", // Empty to trigger fallback
            role: "",
            phone: "",
            district_data: { name: "" }
        };
    });

    const [schoolType, setSchoolType] = useState(() => {
        return localStorage.getItem('schoolType') || 'day';
    });

    const [academic, setAcademic] = useState({
        id: 0,
        name: "Academic Name"
    });

    const getUser = async () => {
        try {
            const response = await fetch(`${API_URL}?getUser=true`);
            if (response.ok) {
                const res = await response.json();
                if (res) {
                    setUser(res);
                }
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    }

    const getAcademic = async () => {
        try {
            const response = await fetch(`${API_URL}?getAcademic=true&school_type=${schoolType}`);
            if (response.ok) {
                const res = await response.json();
                if (res) {
                    setAcademic(res);
                }
                console.log(res);
            }
        } catch (error) {
            console.error("Failed to fetch academic data:", error);
        }
    }

    const login = (userData) => {
        setIsAuthenticated(true);
        const newUser = { ...user, ...userData, username: userData.username || "User" };
        setUser(newUser);

        // Persist
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser({ // Reset to default
            id: 0,
            username: "user",
            email: "user@gmail.com",
            picture: "profile.png",
            role: "",
            phone: "",
            district_data: { name: "" }
        });

        // Clear storage
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        localStorage.removeItem('schoolType');
        // Optional: clear academic data if tied to user
    };

    const toggleSchoolType = (type) => {
        const newType = type || (schoolType === 'day' ? 'open' : 'day');
        setSchoolType(newType);
        localStorage.setItem('schoolType', newType);
    };

    useEffect(() => {
        // If logged in, fetch fresh data to sync with server
        if (isAuthenticated) {
            // getUser(); // Disabled because session cookies aren't shared cross-origin
            getAcademic();
        }
    }, [isAuthenticated, schoolType]);

    return (
        <AppContext.Provider value={{ user, academic, schoolType, setUser, setAcademic, getUser, getAcademic, isAuthenticated, login, logout, toggleSchoolType }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
