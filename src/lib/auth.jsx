// src/lib/auth.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth as authApi } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Try to restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('vk_token');
    if (!token) { setLoading(false); return; }
    authApi.me()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem('vk_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { user, token } = await authApi.login(email, password);
    localStorage.setItem('vk_token', token);
    setUser(user);
    return user;
  }, []);

  const signup = useCallback(async (email, password, name) => {
    const { user, token } = await authApi.signup(email, password, name);
    localStorage.setItem('vk_token', token);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => {});
    localStorage.removeItem('vk_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
