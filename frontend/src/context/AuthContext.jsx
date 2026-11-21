import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

// Guest checkout remains available, but guest users must never be represented
// as authenticated users or send a fake JWT to protected backend endpoints.

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mrkzone_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('mrkzone_token') || '');
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const loadUserProfile = useCallback(async () => {
    const storedToken = localStorage.getItem('mrkzone_token');
    if (!storedToken) return;
    try {
      const res = await authApi.getProfile();
      if (res.data) {
        setUser(res.data);
        localStorage.setItem('mrkzone_user', JSON.stringify(res.data));
      }
    } catch {
      localStorage.removeItem('mrkzone_token');
      localStorage.removeItem('mrkzone_user');
      setToken('');
      setUser(null);
    }
  }, []);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      const authData = res.data;
      localStorage.setItem('mrkzone_token', authData.token);
      localStorage.setItem('mrkzone_user', JSON.stringify({
        id: authData.id,
        email: authData.email,
        fullName: authData.fullName,
        phone: authData.phone,
        role: authData.role,
      }));
      setToken(authData.token);
      setUser({
        id: authData.id,
        email: authData.email,
        fullName: authData.fullName,
        phone: authData.phone,
        role: authData.role,
      });
      success(`Welcome back, ${authData.fullName}!`);
      return authData;
    } catch (err) {
      error(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await authApi.register(userData);
      const authData = res.data;
      localStorage.setItem('mrkzone_token', authData.token);
      setToken(authData.token);
      setUser(authData);
      return authData;
    } catch (err) {
      error(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('mrkzone_token');
    localStorage.removeItem('mrkzone_user');
    setUser(null);
    setToken('');
    success('Logged out successfully');
  };

  // Auth modal disabled: no login or register page
  const openAuthModal = () => {};
  const closeAuthModal = () => {};

  const isAuthenticated = Boolean(token && user);
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        refreshProfile: loadUserProfile,
        authModalOpen: false,
        authModalMode: 'login',
        setAuthModalMode: () => {},
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
