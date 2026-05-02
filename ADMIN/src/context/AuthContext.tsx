import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem('hajj_admin_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        await api.get('/auth/verify');
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('hajj_admin_token');
      } finally {
        setIsLoading(false);
      }
    };
    verify();
  }, []);

  const login = async (username: string, password: string) => {
    const res = await api.post('/auth/login', { username, password });
    const token = res.data.data.token as string;
    localStorage.setItem('hajj_admin_token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('hajj_admin_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
