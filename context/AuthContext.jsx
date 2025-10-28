'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the AuthContext
const AuthContext = createContext(undefined);

// AuthProvider component that wraps your app
export function AuthProvider({ children }) {
    // State to track if user is logged in
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // State to store user information
    const [user, setUser] = useState(null);

    // Loading state for when checking authentication
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is already logged in (on app load)
    useEffect(() => {
        checkAuth();
    }, []);

    // Function to check if user is authenticated (from localStorage)
    const checkAuth = () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Error checking auth:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Login function
    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        // Save to localStorage for persistence
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        // Remove from localStorage
        localStorage.removeItem('user');
        // Reload page to update UI
        window.location.reload();
    };

    // Update user profile
    const updateUser = (updatedData) => {
        const newUserData = { ...user, ...updatedData };
        setUser(newUserData);
        localStorage.setItem('user', JSON.stringify(newUserData));
    };

    // The value that will be provided to components
    const value = {
        isAuthenticated,
        user,
        isLoading,
        login,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use the AuthContext
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
