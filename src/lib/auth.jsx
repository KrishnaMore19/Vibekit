// src/lib/auth.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth as authApi } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount by calling /auth/me
  // The httpOnly cookie is sent automatically via credentials:'include'
  // No localStorage token needed anymore
  useEffect(() => {
    authApi.me()
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    // FIX: server sets httpOnly cookie — we only read the user object from body
    // No token in response body anymore — cookie is set automatically
    const { user } = await authApi.login(email, password);
    setUser(user);
    return user;
  }, []);

  const signup = useCallback(async (email, password, name) => {
    // FIX: same — cookie set by server, we just get user object
    const { user } = await authApi.signup(email, password, name);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => {});
    // FIX: no localStorage to clear — cookie is cleared server-side
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