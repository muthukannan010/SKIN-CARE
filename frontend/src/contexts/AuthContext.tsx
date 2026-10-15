import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

// ─── Context Types ────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (payload: import('../types').RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const me = await authService.me();
      setUser(me);
    } catch {
      setUser(null);
    }
  }, []);

  // Restore session on mount
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    })();
  }, [refreshUser]);

  const login = async (emailOrUsername: string, password: string) => {
    const res = await authService.login({
      email_or_username: emailOrUsername,
      password,
    });
    // If backend returns a bearer token, store it in sessionStorage (not localStorage)
    if (res.access_token) {
      sessionStorage.setItem('nexora_token', res.access_token);
    }
    setUser(res.user);
  };

  const register = async (payload: import('../types').RegisterPayload) => {
    const res = await authService.register(payload);
    if (res.access_token) {
      sessionStorage.setItem('nexora_token', res.access_token);
    }
    setUser(res.user);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      sessionStorage.removeItem('nexora_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
